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
  try {
    const { userId } = req.auth();
    const { prompt, publish } = req.body;
    const plan = req.plan;
    console.log("Checking user plan. Plan is:", plan);

    if (plan !== "premium") {
      return res.json({
        success: false,
        message:
          "This feature is only available for premium users. Please upgrade to premium.",
      });
    }

    const formData = new FormData();
    formData.append("prompt", prompt);

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

    const data = response.data;
    // Validate that data is a buffer and not empty
    if (!data || !Buffer.isBuffer(data) || data.length < 100) {
      return res.json({
        success: false,
        message: "Invalid image data from API",
      });
    }

    const base64Image = `data:image/png;base64,${Buffer.from(data).toString(
      "base64"
    )}`;

    // Try uploading to Cloudinary
    let secure_url;
    try {
      const uploadResult = await cloudinary.uploader.upload(base64Image, {
        resource_type: "image",
      });
      secure_url = uploadResult.secure_url;
    } catch (cloudErr) {
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
    console.log("Error generating image:", error);
    res.json({ success: false, message: error.message });
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
