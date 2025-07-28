import type { Request, Response, NextFunction } from "express"
import Contact from "../models/contact.model"
import ErrorResponse from "../utils/errorResponse"
import asyncHandler from "../utils/asyncHandler"
import sendEmail from "../utils/sendEmail"

// @desc    Get all contact messages
// @route   GET /api/contact
// @access  Private (Admin)
export const getContacts = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const contacts = await Contact.find().sort("-createdAt")

  res.status(200).json({
    success: true,
    count: contacts.length,
    data: contacts,
  })
})

// @desc    Get single contact message
// @route   GET /api/contact/:id
// @access  Private (Admin)
export const getContact = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const contact = await Contact.findById(req.params.id)

  if (!contact) {
    return next(new ErrorResponse(`Contact message not found with id of ${req.params.id}`, 404))
  }

  // Mark as read if not already
  if (!contact.read) {
    contact.read = true
    await contact.save()
  }

  res.status(200).json({
    success: true,
    data: contact,
  })
})

// @desc    Create new contact message
// @route   POST /api/contact
// @access  Public
export const createContact = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, subject, message } = req.body

  // Create contact message
  const contact = await Contact.create({
    name,
    email,
    subject,
    message,
  })

  // Send notification email to admin
  try {
    await sendEmail({
      email: process.env.ADMIN_EMAIL as string,
      subject: `New Contact Form Submission: ${subject}`,
      message: `
        You have received a new message from your portfolio contact form.
        
        Name: ${name}
        Email: ${email}
        Subject: ${subject}
        
        Message:
        ${message}
      `,
    })
  } catch (err) {
    console.log("Email notification failed:", err)
    // Continue even if email fails
  }

  res.status(201).json({
    success: true,
    data: contact,
  })
})

// @desc    Delete contact message
// @route   DELETE /api/contact/:id
// @access  Private (Admin)
export const deleteContact = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const contact = await Contact.findById(req.params.id)

  if (!contact) {
    return next(new ErrorResponse(`Contact message not found with id of ${req.params.id}`, 404))
  }

  await contact.deleteOne()

  res.status(200).json({
    success: true,
    data: {},
  })
})

// @desc    Mark contact message as read/unread
// @route   PUT /api/contact/:id/read
// @access  Private (Admin)
export const toggleReadStatus = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const contact = await Contact.findById(req.params.id)

  if (!contact) {
    return next(new ErrorResponse(`Contact message not found with id of ${req.params.id}`, 404))
  }

  contact.read = !contact.read
  await contact.save()

  res.status(200).json({
    success: true,
    data: contact,
  })
})
