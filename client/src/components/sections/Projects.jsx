import React from "react";
import styled from "styled-components";
import ProjectCard from "../cards/ProjectCard";
import { useProjectsQuery } from "../../hooks/usePortfolioQueries";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: 50px;
  padding: 0px 16px;
  position: relative;
  z-index: 1;
  align-items: center;
  background: ${({ theme }) => theme.background};
  padding-bottom: 50px;
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  max-width: 1200px;
  gap: 24px;
  padding: 20px;
  background: ${({ theme }) => theme.containerBackground};
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  font-size: 48px;
  text-align: center;
  font-weight: 700;
  margin-top: 20px;
  color: #ffffff;  // Change color to white
  @media (max-width: 768px) {
    font-size: 32px;
  }
`;

const Desc = styled.p`
  font-size: 20px;
  text-align: center;
  font-weight: 500;
  color: #ffffff;  // Change color to white
  max-width: 800px;
  margin-bottom: 40px;
  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const CardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  width: 100%;
`;

const ProjectCardWrapper = styled.div`
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }
`;

const Projects = () => {
  const { data: projects = [], isLoading } = useProjectsQuery();

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 900,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <Container id="Projects">
      <Wrapper>
        <Title>Projects</Title>
        <Desc>
          I have worked on a wide range of projects. From web apps to interactive
          experiences.
        </Desc>

        {isLoading ? (
          <Desc>Loading projects...</Desc>
        ) : projects.length === 0 ? (
          <Desc>No projects published yet.</Desc>
        ) : (
          <Slider {...settings} style={{ width: "100%" }}>
            {projects.map((project) => (
              <ProjectCardWrapper key={project._id}>
                <ProjectCard project={project} />
              </ProjectCardWrapper>
            ))}
          </Slider>
        )}
      </Wrapper>
    </Container>
  );
};

export default Projects;
