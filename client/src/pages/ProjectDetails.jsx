import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { useProjectsQuery } from "../hooks/usePortfolioQueries";

const Container = styled.div`
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  display: flex;
  justify-content: center;
  padding: 100px 0;
  background: ${({ theme }) => theme.bg};
`;

const Wrapper = styled.div`
  width: 100%;
  max-width: 1100px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 0 20px;
`;

const Title = styled.h1`
  font-size: 42px;
  font-weight: 700;
  text-align: center;
  color: ${({ theme }) => theme.text_primary};
  @media (max-width: 768px) {
    font-size: 32px;
  }
`;

const DateText = styled.div`
  font-size: 16px;
  text-align: center;
  color: ${({ theme }) => theme.text_secondary};
`;

const Image = styled.img`
  width: 100%;
  max-height: 500px;
  object-fit: cover;
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const Desc = styled.div`
  font-size: 18px;
  color: ${({ theme }) => theme.text_primary};
  line-height: 1.5;
  margin-top: 20px;
`;

const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
`;

const Tag = styled.span`
  font-size: 14px;
  padding: 6px 12px;
  border-radius: 20px;
  background: ${({ theme }) => theme.primary + 15};
  color: ${({ theme }) => theme.primary};
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-top: 30px;
`;

const Button = styled.a`
  padding: 12px 24px;
  border-radius: 8px;
  background: ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.text_primary};
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
`;

const ProjectDetails = () => {
    const { id } = useParams();
    const { data: projects = [], isLoading } = useProjectsQuery();
    const [project, setProject] = useState(null);

    useEffect(() => {
        if (projects.length > 0) {
            const foundProject = projects.find((p) => p._id === id);
            setProject(foundProject);
        }
    }, [projects, id]);

    if (isLoading) return <Container>Loading...</Container>;
    if (!project) return <Container>Project not found</Container>;

    return (
        <Container>
            <Wrapper>
                <Title>{project.title}</Title>
                <DateText>
                    {new Date(project.createdAt).toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                    })}
                </DateText>
                <Image src={project.images?.[0]?.url} alt={project.title} />
                <Tags>
                    {project.tech?.map((tag) => (
                        <Tag key={tag}>{tag}</Tag>
                    ))}
                </Tags>
                <Desc>{project.description}</Desc>
                <ButtonGroup>
                    {project.repoUrl && (
                        <Button href={project.repoUrl} target="_blank" rel="noreferrer">
                            View Code
                        </Button>
                    )}
                    {project.demoUrl && (
                        <Button href={project.demoUrl} target="_blank" rel="noreferrer">
                            Live Demo
                        </Button>
                    )}
                </ButtonGroup>
            </Wrapper>
        </Container>
    );
};

export default ProjectDetails;
