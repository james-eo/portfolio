import type { Request, Response, NextFunction } from "express";
import Contact from "../models/contact.model";
import ErrorResponse from "../utils/errorResponse";
import asyncHandler from "../utils/asyncHandler";
import sendEmail from "../utils/sendEmail";

// @desc    Get all contact messages
// @route   GET /api/contact
// @access  Private/Admin
export const getContactMessages = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { read } = req.query;

    let query = {};
    if (read === "true") {
      query = { read: true };
    } else if (read === "false") {
      query = { read: false };
    }

    const contacts = await Contact.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts,
    });
  }
);

// @desc    Get single contact message
// @route   GET /api/contact/:id
// @access  Private/Admin
export const getContactMessageById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return next(
        new ErrorResponse(
          `Contact message not found with id of ${req.params.id}`,
          404
        )
      );
    }

    res.status(200).json({
      success: true,
      data: contact,
    });
  }
);

// @desc    Create contact message
// @route   POST /api/contact
// @access  Public
export const createContactMessage = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, subject, message } = req.body;
    // Validate required fields
    if (!name) {
      return next(new ErrorResponse("Name is required", 400));
    }

    if (!email) {
      return next(new ErrorResponse("Email is required", 400));
    }

    if (!subject) {
      return next(new ErrorResponse("Subject is required", 400));
    }

    if (!message) {
      return next(new ErrorResponse("Message is required", 400));
    }

    // Validate email format
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return next(
        new ErrorResponse("Please provide a valid email address", 400)
      );
    }

    const contact = await Contact.create(req.body);

    // Send notification email to admin (optional)
    try {
      if (process.env.ADMIN_EMAIL) {
        await sendEmail({
          email: process.env.ADMIN_EMAIL,
          subject: `New Contact Form Submission: ${subject}`,
          message: `
          New contact form submission received:
          
          Name: ${name}
          Email: ${email}
          Subject: ${subject}
          Message: ${message}
          
          Submitted at: ${new Date().toLocaleString()}
        `,
        });
      }
    } catch (error) {
      console.error("Failed to send notification email:", error);
      // Don't fail the request if email sending fails
    }

    res.status(201).json({
      success: true,
      data: contact,
      message: "Message submitted successfully",
    });
  }
);

// @desc    Mark contact message as read
// @route   PUT /api/contact/:id/read
// @access  Private/Admin
export const markAsRead = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { read: true },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!contact) {
      return next(
        new ErrorResponse(
          `Contact message not found with id of ${req.params.id}`,
          404
        )
      );
    }

    res.status(200).json({
      success: true,
      data: contact,
    });
  }
);

// @desc    Delete contact message
// @route   DELETE /api/contact/:id
// @access  Private/Admin
export const deleteContactMessage = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return next(
        new ErrorResponse(
          `Contact message not found with id of ${req.params.id}`,
          404
        )
      );
    }

    await contact.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
      message: "Message deleted successfully",
    });
  }
);
