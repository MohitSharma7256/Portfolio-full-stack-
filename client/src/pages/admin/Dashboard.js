import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const Container = styled.div`
    min-height: 100vh;
    padding: 2rem;
    background: #f5f5f5;
    @media (max-width: 768px) {
        padding: 1rem;
    }
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    background: white;
    padding: 1.5rem;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    @media (max-width: 768px) {
        flex-direction: column;
        gap: 1rem;
        align-items: stretch;
        text-align: center;
    }
`;

const Title = styled.h1`
    color: #333;
    margin: 0;
    @media (max-width: 768px) {
        font-size: 1.5rem;
    }
`;

const ButtonGroup = styled.div`
    display: flex;
    gap: 1rem;
    @media (max-width: 768px) {
        justify-content: center;
        width: 100%;
        button {
            flex: 1;
        }
    }
`;

const TabContainer = styled.div`
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
    flex-wrap: wrap;
    @media (max-width: 768px) {
        gap: 0.5rem;
        button {
            flex: 1;
            padding: 0.5rem 1rem;
            font-size: 0.9rem;
        }
    }
`;

const Tab = styled.button`
    padding: 0.75rem 1.5rem;
    background: ${props => props.active ? '#667eea' : 'white'};
    color: ${props => props.active ? 'white' : '#333'};
    border: none;
    border-radius: 5px;
    cursor: pointer;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    
    &:hover {
        opacity: 0.9;
    }
`;

const ContentArea = styled.div`
    background: white;
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    @media (max-width: 768px) {
        padding: 1rem;
    }
`;

const StatsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
    @media (max-width: 768px) {
        grid-template-columns: 1fr;
        gap: 1rem;
    }
`;

const StatCard = styled.div`
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 1.5rem;
    border-radius: 10px;
    
    h3 {
        margin: 0 0 0.5rem 0;
        font-size: 2rem;
    }
    
    p {
        margin: 0;
        opacity: 0.9;
    }
`;

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [activeTab, setActiveTab] = useState('overview');
    const { data: stats } = useQuery({
        queryKey: ['adminStats'],
        queryFn: async () => {
            const { data } = await API.get('/admin/stats');
            return data;
        }
    });

    return (
        <Container>
            <Header>
                <Title>Admin Dashboard</Title>
                <ButtonGroup>
                    <Button variant="outlined" onClick={() => navigate('/')}>
                        Back to Home
                    </Button>
                    <Button variant="contained" color="error" onClick={logout}>
                        Logout
                    </Button>
                </ButtonGroup>
            </Header>

            <TabContainer>
                <Tab
                    active={activeTab === 'overview'}
                    onClick={() => setActiveTab('overview')}
                >
                    Overview
                </Tab>
                <Tab
                    active={activeTab === 'projects'}
                    onClick={() => {
                        setActiveTab('projects');
                        navigate('/admin/projects');
                    }}
                >
                    Projects
                </Tab>
            </TabContainer>

            <ContentArea>
                {activeTab === 'overview' && (
                    <>
                        <h2>Dashboard Overview</h2>
                        <StatsGrid>
                            <StatCard>
                                <h3>{stats?.projectCount || 0}</h3>
                                <p>Total Projects</p>
                            </StatCard>
                            <StatCard>
                                <h3>{stats?.totalMessages || 0}</h3>
                                <p>Total Messages</p>
                            </StatCard>
                            <StatCard>
                                <h3>{stats?.unreadMessages || 0}</h3>
                                <p>Unread Messages</p>
                            </StatCard>
                            <StatCard>
                                <h3>{stats?.resumeDownloads || 0}</h3>
                                <p>Resume Downloads</p>
                            </StatCard>
                        </StatsGrid>
                        <Box sx={{ mt: 4 }}>
                            <Typography variant="h6" gutterBottom>Welcome to the Admin Panel</Typography>
                            <Typography paragraph>
                                Use the navigation menu to manage different sections of your portfolio.
                            </Typography>
                            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => {
                                        setActiveTab('projects');
                                        navigate('/admin/projects');
                                    }}
                                >
                                    Manage Projects
                                </Button>
                            </Box>
                        </Box>
                    </>
                )}
            </ContentArea>
        </Container>
    );
};

export default AdminDashboard;