'use client';

import type React from 'react';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Github, Linkedin, Youtube, MessageSquare, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { contactAPI } from '@/lib/api';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await contactAPI.submitContactForm(formData);

      toast.success("Thank you for your message. I'll get back to you soon.");

      // Clear the form after successful submission
      resetForm();
    } catch (error) {
      console.error('Error submitting contact form:', error);
      toast.error('Failed to send your message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="section-container">
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="section-heading">
          <MessageSquare size={24} className="mr-2 text-primary" /> Contact Me
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <Card className="border border-muted overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6 md:p-11">
                <h3 className="text-2xl font-bold mb-2">Let&apos;s Work Together</h3>
                <p className="text-foreground/70 mb-6">
                  Have a project in mind? Let&apos;s discuss how I can help bring your ideas to
                  life.
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Input
                        name="name"
                        placeholder="Your Name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="rounded-lg border-muted focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                      />
                    </div>
                    <div>
                      <Input
                        name="email"
                        type="email"
                        placeholder="Your Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="rounded-lg border-muted focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <Input
                      name="phone"
                      type="tel"
                      placeholder="Your Phone Number (Optional)"
                      value={formData.phone}
                      onChange={handleChange}
                      className="rounded-lg border-muted focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    />
                  </div>

                  <div>
                    <Input
                      name="subject"
                      placeholder="Subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="rounded-lg border-muted focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    />
                  </div>

                  <div>
                    <Textarea
                      name="message"
                      placeholder="Tell me about your project..."
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
                      required
                      className="rounded-lg border-muted resize-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    />
                  </div>

                  <Button
                    type="submit"
                    className={`w-full rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${
                      isSubmitting
                        ? 'cursor-not-allowed opacity-70'
                        : 'cursor-pointer hover:shadow-md hover:scale-105'
                    }`}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <ArrowRight size={18} />
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Social Media Section */}
          <div>
            <Card className="border border-muted overflow-hidden shadow-lg h-full">
              <CardContent className="p-6 md:p-8 flex flex-col justify-between h-full">
                <div>
                  <h3 className="text-xl font-bold mb-6">Connect With Me</h3>
                  <p className="text-foreground/70 text-sm mb-8">
                    Follow me on social platforms or reach out directly.
                  </p>
                </div>

                <div className="space-y-2">
                  {/* GitHub */}
                  <a
                    href="https://github.com/james-eo"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 rounded-lg border border-muted hover:border-primary hover:bg-primary/5 transition-all duration-200 group"
                  >
                    <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <Github className="text-primary h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">GitHub</h4>
                      <p className="text-xs text-foreground/60">View my projects</p>
                    </div>
                    <ArrowRight className="opacity-0 group-hover:opacity-100 transition-opacity h-4 w-4 text-primary" />
                  </a>

                  {/* LinkedIn */}
                  <a
                    href="https://linkedin.com/in/james-o"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 rounded-lg border border-muted hover:border-primary hover:bg-primary/5 transition-all duration-200 group"
                  >
                    <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <Linkedin className="text-primary h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">LinkedIn</h4>
                      <p className="text-xs text-foreground/60">Professional profile</p>
                    </div>
                    <ArrowRight className="opacity-0 group-hover:opacity-100 transition-opacity h-4 w-4 text-primary" />
                  </a>

                  {/* X (Twitter) */}
                  <a
                    href="https://twitter.com/james_eo"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 rounded-lg border border-muted hover:border-primary hover:bg-primary/5 transition-all duration-200 group"
                  >
                    <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <svg
                        className="h-5 w-5 text-primary"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.631l-5.1-6.694-5.834 6.694H2.882l7.732-8.835L1.227 2.25h6.802l4.557 6.03L17.739 2.25h.505zm-1.07 17.537h1.836L5.916 4.123H3.95z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">X</h4>
                      <p className="text-xs text-foreground/60">Latest updates</p>
                    </div>
                    <ArrowRight className="opacity-0 group-hover:opacity-100 transition-opacity h-4 w-4 text-primary" />
                  </a>

                  {/* YouTube */}
                  <a
                    href="https://youtube.com/channel/your-channel-id"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 rounded-lg border border-muted hover:border-primary hover:bg-primary/5 transition-all duration-200 group"
                  >
                    <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <Youtube className="text-primary h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">YouTube</h4>
                      <p className="text-xs text-foreground/60">Channel</p>
                    </div>
                    <ArrowRight className="opacity-0 group-hover:opacity-100 transition-opacity h-4 w-4 text-primary" />
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Contact;
