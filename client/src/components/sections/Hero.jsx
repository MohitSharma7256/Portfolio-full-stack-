import React from "react";
import styled from "styled-components";
import Typewriter from "typewriter-effect";
import HeroImg from "../../images/HeroImageMohit.jpg";
import HeroBgAnimation from "../HeroBgAnimation";
import { Tilt } from "react-tilt";
import { motion } from "framer-motion";
import {
  headContainerAnimation,
  headContentAnimation,
  headTextAnimation,
} from "../../utils/motion";
import StarCanvas from "../canvas/Stars";
import { useProfileQuery } from "../../hooks/usePortfolioQueries";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import API from "../../api/axios";

// ─────────────────────────────────────────────────────────────────────────────
// Styled Components (clean & responsive)
// ─────────────────────────────────────────────────────────────────────────────
const HeroContainer = styled.div`
  display: flex;
  justify-content: center;
  position: relative;
  padding: 80px 30px;
  z-index: 1;

  @media (max-width: 960px) {
    padding: 66px 16px;
  }

  @media (max-width: 640px) {
    padding: 32px 16px;
  }

  clip-path: polygon(0 0, 100% 0, 100% 100%, 70% 95%, 0 100%);
`;

const HeroInnerContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1100px;

  @media (max-width: 960px) {
    flex-direction: column;
  }
`;

const HeroLeftContainer = styled.div`
  width: 100%;
  order: 1;
  flex: 1;

  @media (max-width: 960px) {
    order: 2;
    margin-bottom: 30px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
`;

const HeroRightContainer = styled.div`
  width: 100%;
  order: 2;
  flex: 1;
  display: flex;
  justify-content: flex-end;

  @media (max-width: 960px) {
    order: 1;
    justify-content: center;
    margin-bottom: 60px;
  }

  @media (max-width: 640px) {
    margin-bottom: 40px;
  }
`;

const Title = styled.h1`
  font-weight: 700;
  font-size: 50px;
  color: ${({ theme }) => theme.text_primary};
  line-height: 68px;

  @media (max-width: 960px) {
    font-size: 40px;
    line-height: 48px;
    margin-bottom: 12px;
  }

  @media (max-width: 640px) {
    font-size: 36px;
    line-height: 44px;
  }
`;

const TextLoop = styled.div`
  font-weight: 600;
  font-size: 32px;
  display: flex;
  align-items: center;
  gap: 12px;
  color: ${({ theme }) => theme.text_primary};
  line-height: 68px;
  min-height: 70px; /* prevents jump */

  @media (max-width: 960px) {
    font-size: 26px;
    line-height: 52px;
    min-height: 56px;
    justify-content: center;
  }

  @media (max-width: 640px) {
    font-size: 22px;
    line-height: 48px;
  }
`;

const Span = styled.span`
  color: ${({ theme }) => theme.primary};
`;

const SubTitle = styled.p`
  font-size: 20px;
  line-height: 32px;
  margin-bottom: 42px;
  color: ${({ theme }) => theme.text_primary + "95"};

  @media (max-width: 960px) {
    font-size: 18px;
  }

  @media (max-width: 640px) {
    font-size: 16px;
    line-height: 28px;
  }
`;

const ResumeButton = styled.button`
  -webkit-appearance: none;
  appearance: none;
  width: 95%;
  max-width: 300px;
  text-align: center;
  padding: 16px 0;
  background: linear-gradient(225deg, hsl(271, 100%, 50%), hsl(294, 100%, 50%));
  border: none;
  border-radius: 50px;
  color: white;
  font-weight: 600;
  font-size: 20px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 20px 40px rgba(31, 38, 52, 0.4);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  @media (max-width: 640px) {
    padding: 14px 0;
    font-size: 18px;
  }
`;

const ImageWrapper = styled.div`
  width: 100%;
  max-width: 400px;
  aspect-ratio: 1 / 1;

  @media (max-width: 640px) {
    max-width: 280px;
  }
`;

const Img = styled.img`
  border-radius: 50%;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border: 4px solid ${({ theme }) => theme.primary};
`;

const HeroBg = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: -1;
`;

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────
const Hero = () => {
  const { data: profile } = useProfileQuery();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const { mutate: handleDownload, isPending: downloading } = useMutation({
    mutationFn: async () => {
      const res = await API.post("/resume/download", {}, { responseType: "blob" });
      return res;
    },
    onSuccess: (res) => {
      const disposition = res.headers["content-disposition"];
      let fileName = profile?.name ? `${profile.name}-Resume.pdf` : "Resume.pdf";

      if (disposition) {
        const match = disposition.match(/filename="?([^"]+)"?/);
        if (match?.[1]) fileName = decodeURIComponent(match[1]);
      }

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    },
    onError: () => {
      alert("Resume is not available yet. Please try again later.");
    },
  });

  const onResumeClick = () => {
    if (!isAuthenticated) return navigate("/login");
    handleDownload();
  };

  const roles = profile?.roles?.length ? profile.roles : ["Full Stack Developer"];

  return (
    <div id="About">
      <HeroContainer>
        <HeroBg>
          <HeroBgAnimation />
        </HeroBg>

        <motion.div {...headContainerAnimation}>
          <HeroInnerContainer>
            {/* LEFT SIDE – Text */}
            <HeroLeftContainer>
              <motion.div {...headTextAnimation}>
                <Title>
                  Hi, I am <br />
                  {profile?.name || "Mohit Sharma"}
                </Title>

                <TextLoop>
                  I am a
                  <Span>
                    <Typewriter
                      options={{
                        strings: roles,
                        autoStart: true,
                        loop: true,
                        deleteSpeed: 50,
                      }}
                    />
                  </Span>
                </TextLoop>
              </motion.div>

              <motion.div {...headContentAnimation}>
                <SubTitle>
                  {profile?.bio ||
                    "I build modern, secure, and scalable digital experiences."}
                </SubTitle>

                <ResumeButton onClick={onResumeClick} disabled={downloading}>
                  {downloading ? "Preparing..." : profile?.ctaLabel || "Check Resume"}
                </ResumeButton>

                {profile?.resumeIntro && (
                  <SubTitle style={{ fontSize: "16px", marginTop: "16px", opacity: 0.9 }}>
                    {profile.resumeIntro}
                  </SubTitle>
                )}
              </motion.div>
            </HeroLeftContainer>

            {/* RIGHT SIDE – Image */}
            <HeroRightContainer>
              <motion.div {...headContentAnimation}>
                <Tilt
                  options={{
                    max: 20,
                    scale: 1.02,
                    speed: 400,
                    glare: true,
                    "max-glare": 0.3,
                  }}
                >
                  <ImageWrapper>
                    <Img
                      src={profile?.heroImage?.url || HeroImg}
                      alt={`${profile?.name || "Mohit Sharma"} - Portfolio`}
                    />
                  </ImageWrapper>
                </Tilt>
              </motion.div>
            </HeroRightContainer>
          </HeroInnerContainer>
        </motion.div>
      </HeroContainer>
    </div>
  );
};

export default Hero;