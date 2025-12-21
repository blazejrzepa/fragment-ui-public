/**
 * Professional form templates for generate API
 */

import type { FormTemplate } from "../types";

export const FORM_TEMPLATES: Record<string, FormTemplate> = {
  registration: {
    title: "Create Your Account",
    description: "Join us today! Fill out the form below to create your account and get started.",
    fields: [
      {
        name: "firstName",
        type: "text",
        label: "First Name",
        placeholder: "John",
        required: true,
        validation: {
          minLength: 2,
          maxLength: 50,
        },
      },
      {
        name: "lastName",
        type: "text",
        label: "Last Name",
        placeholder: "Doe",
        required: true,
        validation: {
          minLength: 2,
          maxLength: 50,
        },
      },
      {
        name: "email",
        type: "email",
        label: "Email Address",
        placeholder: "john.doe@example.com",
        helperText: "We'll never share your email with anyone else.",
        required: true,
        validation: {
          pattern: "email",
        },
      },
      {
        name: "password",
        type: "password",
        label: "Password",
        placeholder: "Create a strong password",
        helperText: "Must be at least 8 characters with uppercase, lowercase, and numbers.",
        required: true,
        validation: {
          minLength: 8,
          pattern: "password",
        },
      },
      {
        name: "confirmPassword",
        type: "password",
        label: "Confirm Password",
        placeholder: "Re-enter your password",
        required: true,
        validation: {
          custom: "matchPassword",
        },
      },
      {
        name: "phone",
        type: "tel",
        label: "Phone Number",
        placeholder: "+1 (555) 123-4567",
        helperText: "Optional. We'll use this for important account updates.",
        required: false,
        validation: {
          pattern: "phone",
        },
      },
      {
        name: "dateOfBirth",
        type: "datepicker",
        label: "Date of Birth",
        placeholder: "Select your date of birth",
        helperText: "You must be at least 18 years old to register.",
        required: true,
        validation: {
          custom: "age18",
        },
      },
      {
        name: "terms",
        type: "checkbox",
        label: "I agree to the Terms of Service and Privacy Policy",
        placeholder: "",
        required: true,
      },
      {
        name: "newsletter",
        type: "checkbox",
        label: "Subscribe to our newsletter for updates and special offers",
        placeholder: "",
        required: false,
      },
    ],
    submitText: "Create Account",
    successMessage: "Account created successfully! Welcome aboard!",
  },
  contact: {
    title: "Get in Touch",
    description: "Have a question or want to work together? Send us a message and we'll get back to you as soon as possible.",
    fields: [
      {
        name: "name",
        type: "text",
        label: "Full Name",
        placeholder: "Jane Smith",
        required: true,
        validation: {
          minLength: 2,
        },
      },
      {
        name: "email",
        type: "email",
        label: "Email Address",
        placeholder: "jane.smith@example.com",
        required: true,
        validation: {
          pattern: "email",
        },
      },
      {
        name: "subject",
        type: "text",
        label: "Subject",
        placeholder: "What is this regarding?",
        required: true,
        validation: {
          minLength: 5,
        },
      },
      {
        name: "message",
        type: "textarea",
        label: "Message",
        placeholder: "Tell us more about your inquiry...",
        helperText: "Please provide as much detail as possible.",
        required: true,
        validation: {
          minLength: 10,
          maxLength: 1000,
        },
      },
    ],
    submitText: "Send Message",
    successMessage: "Thank you! Your message has been sent. We'll respond within 24 hours.",
  },
  login: {
    title: "Welcome Back",
    description: "Sign in to your account to continue.",
    fields: [
      {
        name: "email",
        type: "email",
        label: "Email Address",
        placeholder: "your.email@example.com",
        required: true,
        validation: {
          pattern: "email",
        },
      },
      {
        name: "password",
        type: "password",
        label: "Password",
        placeholder: "Enter your password",
        required: true,
      },
      {
        name: "remember",
        type: "checkbox",
        label: "Remember me for 30 days",
        placeholder: "",
        required: false,
      },
    ],
    submitText: "Sign In",
    successMessage: "Welcome back! Redirecting to your dashboard...",
  },
  feedback: {
    title: "Share Your Feedback",
    description: "We'd love to hear from you! Your feedback helps us improve our service.",
    fields: [
      {
        name: "name",
        type: "text",
        label: "Your Name",
        placeholder: "John Doe",
        required: true,
        validation: {
          minLength: 2,
        },
      },
      {
        name: "email",
        type: "email",
        label: "Email Address",
        placeholder: "john.doe@example.com",
        required: true,
        validation: {
          pattern: "email",
        },
      },
      {
        name: "rating",
        type: "select",
        label: "Rating",
        placeholder: "Select a rating",
        required: true,
        options: [
          { label: "5 - Excellent", value: "5" },
          { label: "4 - Very Good", value: "4" },
          { label: "3 - Good", value: "3" },
          { label: "2 - Fair", value: "2" },
          { label: "1 - Poor", value: "1" },
        ],
      },
      {
        name: "feedback",
        type: "textarea",
        label: "Your Feedback",
        placeholder: "Tell us what you think...",
        helperText: "Please share your thoughts, suggestions, or concerns.",
        required: true,
        validation: {
          minLength: 10,
          maxLength: 500,
        },
      },
    ],
    submitText: "Submit Feedback",
    successMessage: "Thank you for your feedback! We appreciate your input.",
  },
  newsletter: {
    title: "Subscribe to Our Newsletter",
    description: "Stay updated with our latest news, tips, and exclusive offers.",
    fields: [
      {
        name: "email",
        type: "email",
        label: "Email Address",
        placeholder: "your.email@example.com",
        helperText: "We'll send you weekly updates. You can unsubscribe at any time.",
        required: true,
        validation: {
          pattern: "email",
        },
      },
      {
        name: "name",
        type: "text",
        label: "Your Name (Optional)",
        placeholder: "John Doe",
        required: false,
      },
      {
        name: "interests",
        type: "checkbox",
        label: "I'm interested in product updates and special offers",
        placeholder: "",
        required: false,
      },
    ],
    submitText: "Subscribe",
    successMessage: "Thank you for subscribing! Check your email to confirm.",
  },
  "password-reset": {
    title: "Reset Your Password",
    description: "Enter your email address and we'll send you a link to reset your password.",
    fields: [
      {
        name: "email",
        type: "email",
        label: "Email Address",
        placeholder: "your.email@example.com",
        helperText: "We'll send password reset instructions to this email.",
        required: true,
        validation: {
          pattern: "email",
        },
      },
    ],
    submitText: "Send Reset Link",
    successMessage: "Password reset link sent! Please check your email.",
  },
  profile: {
    title: "Edit Profile",
    description: "Update your personal information and preferences.",
    fields: [
      {
        name: "firstName",
        type: "text",
        label: "First Name",
        placeholder: "John",
        required: true,
        validation: {
          minLength: 2,
        },
      },
      {
        name: "lastName",
        type: "text",
        label: "Last Name",
        placeholder: "Doe",
        required: true,
        validation: {
          minLength: 2,
        },
      },
      {
        name: "email",
        type: "email",
        label: "Email Address",
        placeholder: "john.doe@example.com",
        required: true,
        validation: {
          pattern: "email",
        },
      },
      {
        name: "phone",
        type: "tel",
        label: "Phone Number",
        placeholder: "+1 (555) 123-4567",
        required: false,
        validation: {
          pattern: "phone",
        },
      },
      {
        name: "bio",
        type: "textarea",
        label: "Bio",
        placeholder: "Tell us about yourself...",
        helperText: "A short description about yourself (optional).",
        required: false,
        validation: {
          maxLength: 200,
        },
      },
    ],
    submitText: "Save Changes",
    successMessage: "Profile updated successfully!",
  },
  checkout: {
    title: "Checkout",
    description: "Complete your purchase by filling in your payment and shipping information.",
    fields: [
      {
        name: "fullName",
        type: "text",
        label: "Full Name",
        placeholder: "John Doe",
        required: true,
        validation: {
          minLength: 2,
        },
      },
      {
        name: "email",
        type: "email",
        label: "Email Address",
        placeholder: "john.doe@example.com",
        required: true,
        validation: {
          pattern: "email",
        },
      },
      {
        name: "phone",
        type: "tel",
        label: "Phone Number",
        placeholder: "+1 (555) 123-4567",
        required: true,
        validation: {
          pattern: "phone",
        },
      },
      {
        name: "address",
        type: "text",
        label: "Street Address",
        placeholder: "123 Main Street",
        required: true,
      },
      {
        name: "city",
        type: "text",
        label: "City",
        placeholder: "New York",
        required: true,
      },
      {
        name: "zipCode",
        type: "text",
        label: "ZIP / Postal Code",
        placeholder: "10001",
        required: true,
        validation: {
          pattern: "^[0-9]{5}(-[0-9]{4})?$",
        },
      },
      {
        name: "country",
        type: "select",
        label: "Country",
        placeholder: "Select country",
        required: true,
        options: [
          { label: "United States", value: "US" },
          { label: "Canada", value: "CA" },
          { label: "United Kingdom", value: "UK" },
          { label: "Poland", value: "PL" },
        ],
      },
    ],
    submitText: "Complete Purchase",
    successMessage: "Order placed successfully! You'll receive a confirmation email shortly.",
  },
};

