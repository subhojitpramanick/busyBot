import OpenAI from "openai";
import sql from "../configs/db.js";
import { clerkClient } from "@clerk/express";
import axios from "axios";
import FormData from "form-data";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import pdf from "pdf-parse/lib/pdf-parse.js";

const AI = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

export const generateArticle = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { prompt, length } = req.body;
    const plan = req.plan;
    const freeUsage = req.free_usage;

    if (plan !== "premium" && freeUsage >= 10) {
      return res.json({
        success: false,
        message:
          "You have exhausted your free usage limit. Please upgrade to premium.",
      });
    }

    const response = await AI.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      maxTokens: length,
    });

    const content = response.choices[0].message.content;

    await sql`INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, ${prompt}, ${content}, 'article')`;

    if (plan !== "premium") {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          free_usage: freeUsage + 1,
        },
      });
    }
    return res.json({
      success: true,
      content,
    });
  } catch (error) {
    console.log("Error generating article:", error);
    res.json({ success: false, message: error.message });
  }
};

export const generateBlogTitle = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { prompt } = req.body;
    const plan = req.plan;
    const freeUsage = req.free_usage;

    if (plan !== "premium" && freeUsage >= 10) {
      return res.json({
        success: false,
        message:
          "You have exhausted your free usage limit. Please upgrade to premium.",
      });
    }

    const response = await AI.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      maxTokens: 100,
    });

    const content = response.choices[0].message.content;

    await sql`INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, ${prompt}, ${content}, 'blog_title')`;

    if (plan !== "premium") {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          free_usage: freeUsage + 1,
        },
      });
    }
    return res.json({
      success: true,
      content,
    });
  } catch (error) {
    console.log("Error generating article:", error);
    res.json({ success: false, message: error.message });
  }
};

export const generateImage = async (req, res) => {
  console.log("--- generateImage function was called ---");

  try {
    const { userId } = req.auth();
    const { prompt, publish } = req.body;
    const plan = req.plan;
    console.log("User plan is:", plan);

    if (plan !== "premium") {
      console.log("User does not have premium plan. Returning early.");
      return res.json({
        success: false,
        message:
          "This feature is only available for premium users. Please upgrade to premium.",
      });
    }

    const formData = new FormData();
    formData.append("prompt", prompt);

    console.log("Preparing to call ClipDrop API...");

    const response = await axios.post(
      "https://clipdrop-api.co/text-to-image/v1",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          "x-api-key": process.env.CLIPDROP_API_KEY,
        },
        responseType: "arraybuffer",
      }
    );

    console.log("Successfully received response from ClipDrop API.");

    const data = response.data;
    if (!data || !Buffer.isBuffer(data) || data.length < 100) {
      console.log("Invalid image data received from ClipDrop API.");
      return res.json({
        success: false,
        message: "Invalid image data from API",
      });
    }

    const base64Image = `data:image/png;base64,${Buffer.from(data).toString(
      "base64"
    )}`;

    let secure_url;
    try {
      const uploadResult = await cloudinary.uploader.upload(base64Image, {
        resource_type: "image",
      });
      secure_url = uploadResult.secure_url;
    } catch (cloudErr) {
      console.log("Cloudinary upload failed:", cloudErr);
      return res.json({
        success: false,
        message: "Cloudinary upload failed: " + cloudErr.message,
      });
    }

    await sql`INSERT INTO creations (user_id, prompt, content, type , publish) VALUES (${userId}, ${prompt}, ${secure_url}, 'image', ${
      publish ?? false
    })`;

    res.json({
      success: true,
      content: secure_url,
    });
  } catch (error) {
    console.error("--- ERROR IN generateImage CATCH BLOCK ---");
    if (error.response) {
      // The API responded with an error status code (4xx or 5xx)
      console.error("API Error Status:", error.response.status);
      console.error("API Error Data:", error.response.data.toString());
    } else if (error.request) {
      // The request was made but no response was received
      console.error("No response received from API.");
    } else {
      // Something else happened
      console.error("Error Message:", error.message);
    }
    res.json({
      success: false,
      message: "An error occurred during image generation.",
    });
  }
};

export const removeImageBackground = async (req, res) => {
  try {
    const { userId } = req.auth();
    const image = req.file;
    const plan = req.plan;

    if (plan !== "premium") {
      return res.json({
        success: false,
        message:
          "This feature is only available for premium users. Please upgrade to premium.",
      });
    }

    // Try uploading to Cloudinary
    let secure_url;
    try {
      const uploadResult = await cloudinary.uploader.upload(image.path, {
        resource_type: "image",
        transformation: [
          {
            effect: "background_removal",
            background_removal: "remove_the_background",
          },
        ],
      });
      secure_url = uploadResult.secure_url;
    } catch (cloudErr) {
      return res.json({
        success: false,
        message: "Cloudinary upload failed: " + cloudErr.message,
      });
    }

    await sql`INSERT INTO creations (user_id, prompt, content, type ) VALUES (${userId}, 'Remove Background from image', ${secure_url}, 'image')`;

    res.json({
      success: true,
      content: secure_url,
    });
  } catch (error) {
    console.log("Error generating image:", error);
    res.json({ success: false, message: error.message });
  }
};

export const removeImageObject = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { object } = req.body;
    const image = req.file;
    const plan = req.plan;

    if (plan !== "premium") {
      return res.json({
        success: false,
        message:
          "This feature is only available for premium users. Please upgrade to premium.",
      });
    }

    // Try uploading to Cloudinary
    let imageUrl;
    try {
      const { public_id } = await cloudinary.uploader.upload(image.path);
      imageUrl = cloudinary.url(public_id, {
        transformation: [
          {
            effect: `gen_remove:${object}`,
          },
        ],
        resource_type: "image",
      });
    } catch (cloudErr) {
      return res.json({
        success: false,
        message: "Cloudinary upload failed: " + cloudErr.message,
      });
    }

    await sql`INSERT INTO creations (user_id, prompt, content, type ) VALUES (${userId}, ${`Remove ${object} from image`}, ${imageUrl}, 'image')`;

    res.json({
      success: true,
      content: imageUrl,
    });
  } catch (error) {
    console.log("Error generating image:", error);
    res.json({ success: false, message: error.message });
  }
};

export const resumeReview = async (req, res) => {
  try {
    const { userId } = req.auth();
    const resume = req.file;
    const plan = req.plan;

    if (plan !== "premium") {
      return res.json({
        success: false,
        message:
          "This feature is only available for premium users. Please upgrade to premium.",
      });
    }

    if (resume.size > 5 * 1024 * 1024) {
      res.json({
        success: false,
        message: "File size exceeds 5MB",
      });
    }

    const dataBuffer = fs.readFileSync(resume.path);
    const pdfData = await pdf(dataBuffer);

    const prompt = `Review the following resume and provide constructive feedback on its strengths,weaknesses and areas for improvement.And At first give Ats Score of the Resume content:\n\n ${pdfData.text}`;

    const response = await AI.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      maxTokens: 1000,
    });

    const content = response.choices[0].message.content;

    await sql`INSERT INTO creations (user_id, prompt, content, type ) VALUES (${userId}, 'Resume Review', ${content}, 'resume-review')`;

    res.json({
      success: true,
      content: content,
    });
  } catch (error) {
    console.log("Error generating image:", error);
    res.json({ success: false, message: error.message });
  }
};
