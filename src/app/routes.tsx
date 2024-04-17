'use client'
import * as React from 'react';
import Box from '@mui/material/Box';
import Link from 'next/link';
import Typography from '@mui/material/Typography';
import {
    MemoryRouter,
    Route,
    Routes,
    matchPath,
    useLocation,
} from 'react-router-dom';

import { StaticRouter } from 'react-router-dom/server';
import { ButtonGroup, Button, AppBar, Avatar, Container, IconButton, Menu, MenuItem, Toolbar, Tooltip } from '@mui/material';
import { useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import AdbIcon from '@mui/icons-material/Adb';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { signOut } from 'next-auth/react'

/*
<Button><Link href="/" className=''>Home</Link></Button>
            <Button><Link href="/trades" className=''>Trades</Link></Button>
            <Button><Link href="/history">History</Link></Button>
*/

const pages = [
    { title: 'Home', href: '/' },
    { title: 'Trades', href: '/trades' },
    { title: 'History', href: '/history' }
];
const settings = ['Profile', 'Logout'];

function Router(props: { children?: React.ReactNode }) {
    const { children } = props;
    if (typeof window === 'undefined') {
        return <StaticRouter location="/drafts">{children}</StaticRouter>;
    }

    return (
        <MemoryRouter initialEntries={['/drafts']} initialIndex={0}>
            {children}
        </MemoryRouter>
    );
}

function useRouteMatch(patterns: readonly string[]) {
    const { pathname } = useLocation();

    for (let i = 0; i < patterns.length; i += 1) {
        const pattern = patterns[i];
        const possibleMatch = matchPath(pattern, pathname);
        if (possibleMatch !== null) {
            return possibleMatch;
        }
    }

    return null;
}

function MyTabs() {
    // You need to provide the routes in descendant order.
    // This means that if you have nested routes like:
    // users, users/new, users/edit.
    // Then the order should be ['users/add', 'users/edit', 'users'].
    const routeMatch = useRouteMatch(['/inbox/:id', '/drafts', '/trash']);
    const currentTab = routeMatch?.pattern?.path;

    return (
        // <Tabs value={currentTab}>
        //   <Tab label="Inbox" value="/inbox/:id" to="/inbox/1" component={Link} />
        //   <Tab label="Drafts" value="/drafts" to="/drafts" component={Link} />
        //   <Tab label="Trash" value="/trash" to="/trash" component={Link} />
        // </Tabs>
        <ButtonGroup variant="contained" aria-label="Basic button group">
            <Button><Link href="/" className=''>Home</Link></Button>
            <Button><Link href="/trades" className=''>Trades</Link></Button>
            <Button><Link href="/history">History</Link></Button>
        </ButtonGroup>
    );
}

function CurrentRoute() {
    const location = useLocation();

    return (
        <Typography variant="body2" sx={{ pb: 2 }} color="text.secondary">
            Current route: {location.pathname}
        </Typography>
    );
}

export default function TabsRouter() {
    const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleSignout = () => {
        handleCloseUserMenu();
        signOut();
    }

    return (
        <Router>
            {/* <Routes>
          <Route path="*" element={<CurrentRoute />} />
        </Routes> */}
            {/* <Box sx={{ width: '100%', padding: '0px 0px 20px 0px' }} >
                <MyTabs />
            </Box> */}
            <AppBar position="static" sx={{ margin: '0px 0px 20px 0px' }}>
                <Container maxWidth="xl">
                    <Toolbar disableGutters>
                        {/* <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} /> */}
                        {/* <Typography
                            variant="h6"
                            noWrap
                            component="a"
                            href="#app-bar-with-responsive-menu"
                            sx={{
                                mr: 2,
                                display: { xs: 'none', md: 'flex' },
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                letterSpacing: '.3rem',
                                color: 'inherit',
                                textDecoration: 'none',
                            }}
                        >
                            MZ
                        </Typography> */}

                        <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleOpenNavMenu}
                                color="inherit"
                            >
                                <MenuIcon />
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorElNav}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                                open={Boolean(anchorElNav)}
                                onClose={handleCloseNavMenu}
                                sx={{
                                    display: { xs: 'block', md: 'none' },
                                }}
                            >
                                {pages.map((page) => (
                                    <MenuItem key={page.title} onClick={handleCloseNavMenu} LinkComponent={Link} href={page.href}>
                                        {/* {page.title} */}
                                        <Typography textAlign="center">{page.title}</Typography>
                                        {/* <Button
                                            key={page.title}
                                            onClick={handleCloseNavMenu}
                                            href={page.href}
                                            LinkComponent={Link}
                                            sx={{ my: 2, color: 'white', display: 'block' }}>
                                        </Button> */}
                                    </MenuItem>
                                ))}
                            </Menu>
                        </Box>
                        <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
                        <Typography
                            variant="h5"
                            noWrap
                            component="a"
                            href="#app-bar-with-responsive-menu"
                            sx={{
                                mr: 2,
                                display: { xs: 'flex', md: 'none' },
                                flexGrow: 1,
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                letterSpacing: '.3rem',
                                color: 'inherit',
                                textDecoration: 'none',
                            }}
                        >
                            LOGO
                        </Typography>
                        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                            {pages.map((page) => (
                                <Button
                                    key={page.title}
                                    onClick={handleCloseNavMenu}
                                    href={page.href}
                                    LinkComponent={Link}
                                    sx={{ my: 2, color: 'white', display: 'block' }}>
                                    {page.title}
                                    {/* <Link href={page.href}>
                                    </Link> */}
                                </Button>
                            ))}
                        </Box>

                        <Box sx={{ flexGrow: 0 }}>
                            <Tooltip title="Open settings">
                                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                    <AccountCircle />
                                </IconButton>
                            </Tooltip>
                            <Menu
                                sx={{ mt: '45px' }}
                                id="menu-appbar"
                                anchorEl={anchorElUser}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenu}
                            >
                                {/* {settings.map((setting) => (
                                    <MenuItem key={setting} onClick={handleCloseUserMenu}>
                                        <Typography textAlign="center">{setting}</Typography>
                                    </MenuItem>
                                ))} */}
                                <MenuItem key='signout' onClick={handleSignout}>
                                    <Typography textAlign="center">Sign Out</Typography>
                                </MenuItem>
                            </Menu>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
        </Router>
    );
}