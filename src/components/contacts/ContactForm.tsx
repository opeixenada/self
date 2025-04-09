import React, { useState } from 'react';
import { CheckCircle, Loader2, Send } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { ContactData, submitContactToFirebase } from '../../firebase/utils.ts';

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState<ContactData>({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Void function wrapper around the async function
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void submitForm();
  };

  // Async logic
  const submitForm = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await submitContactToFirebase(formData);
      setIsSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Error submitting form:', error);
      const errorMessage =
        error instanceof Error && error.message.includes('timed out')
          ? 'Request timed out. Please try again later.'
          : 'Sorry, something went wrong. Please try again.';

      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }

    // Reset the submission status after 5 seconds if submission was successful
    if (!submitError) {
      setTimeout(() => {
        // Small animation delay for better UX
        setIsSubmitted(false);
      }, 5000);
    }
  };

  return (
    <div className="flex min-h-[450px] flex-col">
      <AnimatePresence mode="wait">
        {isSubmitted ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: {
                duration: 0.5,
                ease: 'easeOut',
              },
            }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-1 flex-col items-center justify-center text-center"
          >
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{
                scale: 1,
                opacity: 1,
                transition: {
                  delay: 0.2,
                  duration: 0.5,
                  type: 'spring',
                  stiffness: 200,
                },
              }}
              className="bg-theme-gold/40 text-theme-primary mb-6 flex h-20 w-20 items-center justify-center rounded-full"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{
                  scale: 1,
                  transition: {
                    delay: 0.5,
                    duration: 0.3,
                    type: 'spring',
                  },
                }}
              >
                <CheckCircle size={30} />
              </motion.div>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: {
                  delay: 0.6,
                  duration: 0.3,
                },
              }}
              className="text-theme-secondary mb-3"
            >
              Message sent!
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: {
                  delay: 0.8,
                  duration: 0.3,
                },
              }}
              className="text-theme-secondary"
            >
              Thank you for reaching out.
              <br className="hidden md:inline" /> I'll get back to you as soon as possible.
            </motion.p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } }}
            exit={{ opacity: 0, y: -20 }}
            onSubmit={handleSubmit}
            className="flex flex-1 flex-col justify-start space-y-6"
          >
            <h3 className="text-theme-primary mb-6">Send me a message</h3>

            {submitError && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="notification-error"
                role="alert"
              >
                <span className="block sm:inline">{submitError}</span>
              </motion.div>
            )}

            <div>
              <label htmlFor="name" className="label-theme">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                autoComplete="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="input-theme"
              />
            </div>

            <div>
              <label htmlFor="email" className="label-theme">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                autoComplete="email"
                onChange={handleChange}
                required
                className="input-theme"
              />
            </div>

            <div>
              <label htmlFor="message" className="label-theme">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={4}
                maxLength={2000}
                className="input-theme resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-theme-outline mt-auto flex w-full items-center justify-center"
            >
              {isSubmitting ? (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center"
                >
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Sending...
                </motion.span>
              ) : (
                <span className="flex items-center">
                  <Send size={18} className="mr-2" />
                  Send
                </span>
              )}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ContactForm;
