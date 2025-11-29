import React, { useState } from "react";
import styled from "styled-components";
import API from "../../api/axios";
import { useMutation } from "@tanstack/react-query";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-contnet: center;
  position: rlative;
  z-index: 1;
  align-items: center;
`;

const Wrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  width: 100%;
  max-width: 1100px;
  gap: 12px;
  @media (max-width: 960px) {
    flex-direction: column;
  }
`;
const Title = styled.div`
  font-size: 52px;
  text-align: center;
  font-weight: 600;
  margin-top: 20px;
  color: ${({ theme }) => theme.text_primary};
  @media (max-width: 768px) {
    margin-top: 12px;
    font-size: 32px;
  }
`;
const Desc = styled.div`
  font-size: 18px;
  text-align: center;
  font-weight: 600;
  color: ${({ theme }) => theme.text_secondary};
  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const ContactForm = styled.form`
  width: 95%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  background-color: rgba(17, 25, 40, 0.83);
  border: 1px solid rgba(255, 255, 255, 0.125);
  padding: 32px;
  border-radius: 12px;
  box-shadow: rgba(23, 92, 230, 0.1) 0px 4px 24px;
  margin-top: 28px;
  gap: 12px;
`;
const ContactTitle = styled.div`
  font-size: 28px;
  margin-bottom: 6px;
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
`;
const ContactInput = styled.input`
  flex: 1;
  background-color: transparent;
  border: 1px solid ${({ theme }) => theme.text_secondary + 50};
  outline: none;
  font-size: 18px;
  color: ${({ theme }) => theme.text_primary};
  border-radius: 12px;
  padding: 12px 16px;
  &:focus {
    border: 1px solid ${({ theme }) => theme.primary};
  }
`;
const ContactInputMessage = styled.textarea`
  flex: 1;
  background-color: transparent;
  border: 1px solid ${({ theme }) => theme.text_secondary + 50};
  outline: none;
  font-size: 18px;
  color: ${({ theme }) => theme.text_primary};
  border-radius: 12px;
  padding: 12px 16px;
  &:focus {
    border: 1px solid ${({ theme }) => theme.primary};
  }
`;
const ContactButton = styled.button`
  width: 100%;
  text-decoration: none;
  text-align: center;
  background: hsla(271, 100%, 50%, 1);
  padding: 13px 16px;
  margin-top: 2px;
  border-radius: 12px;
  border: none;
  color: ${({ theme }) => theme.text_primary};
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  
  &:hover {
    opacity: 0.9;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #e74c3c;
  font-size: 0.9rem;
  text-align: center;
`;

const SuccessMessage = styled.div`
  color: #2ecc71;
  font-size: 0.9rem;
  text-align: center;
`;
const InfoMessage = styled.div`
  color: #3498db;
  font-size: 0.9rem;
  text-align: center;
  margin-bottom: 1rem;
`;

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const mutation = useMutation({
    mutationFn: (payload) => API.post('/messages', payload),
    onSuccess: () => {
      setSuccess(true);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    },
    onError: (err) => {
      setError(err.response?.data?.message || 'Failed to send message');
    }
  });

  const handelSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    mutation.mutate({
      name,
      email,
      subject,
      body: message
    });
  };

  return (
    <Container id="Education">
      <Wrapper>
        <Title>Contact</Title>
        <Desc
          style={{
            marginBottom: "40px",
          }}
        >
          Feel free to reach out to me for any questions or opportunities!
        </Desc>
        <ContactForm onSubmit={handelSubmit}>
          <ContactTitle>Email Me 🚀</ContactTitle>
          <ContactInput
            placeholder="Your Name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <ContactInput
            placeholder="Your Email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <ContactInput
            placeholder="Subject"
            name="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
          <ContactInputMessage
            placeholder="Message"
            name="message"
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
          {error && <ErrorMessage>{error}</ErrorMessage>}
          {success && <SuccessMessage>Message sent successfully!</SuccessMessage>}
          <ContactButton type="submit" disabled={mutation.isLoading}>
            {mutation.isLoading ? 'Sending...' : 'Send'}
          </ContactButton>
        </ContactForm>
      </Wrapper>
    </Container>
  );
};

export default Contact;
