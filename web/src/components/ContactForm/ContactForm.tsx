import React, {useState} from 'react';
import {AnimatePresence, motion} from 'motion/react';
import styles from './ContactForm.module.scss';
import apiClient from '../../api/apiClient';

interface FormData {
  name: string;
  email: string;
  message: string;
}

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({name: '', email: '', message: ''});
  const [status, setStatus] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
    const {name, value} = e.target;
    setFormData({...formData, [name]: value});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    apiClient.post('/SendEmail', formData)
      .then((response) => {
        if (response.status === 200) {
          setStatus('Message sent successfully.');
          setFormData({name: '', email: '', message: ''});
        } else {
          setStatus('Failed to send message.');
        }
      })
      .catch(() => setStatus('Failed to send message.'));
  };

  return (
    <motion.section
      className={styles.contactSection}
      initial={{opacity: 0, y: 20}}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 0.35, ease: 'easeOut'}}
    >
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.row}>
          <label className={styles.field}>
            <span>Name</span>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Name"
            />
          </label>

          <label className={styles.field}>
            <span>Email</span>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Email"
            />
          </label>
        </div>

        <label className={`${styles.field} ${styles.messageField}`}>
          <span>Message</span>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={6}
            maxLength={1200}
            placeholder="Message"
          />
        </label>

        <motion.button
          type="submit"
          className={styles.sendButton}
          whileHover={{y: -2}}
          whileTap={{scale: 0.98}}
          transition={{duration: 0.16}}
        >
          SEND
        </motion.button>

        <AnimatePresence>
          {status && (
            <motion.p
              className={styles.status}
              initial={{opacity: 0, y: 8}}
              animate={{opacity: 1, y: 0}}
              exit={{opacity: 0, y: 8}}
              transition={{duration: 0.2}}
            >
              {status}
            </motion.p>
          )}
        </AnimatePresence>
      </form>
    </motion.section>
  );
};

export default ContactForm;
