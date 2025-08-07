import { useState } from 'react';
import { Menu, MenuItem, IconButton, Box, Paper } from '@mui/material';
import { useTranslation } from 'react-i18next';
import LanguageIcon from '@mui/icons-material/Language';

import EsFlag from '../assets/spain-flag.svg';
import EnFlag from '../assets/uk-flag.svg';

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (lang) => {
        if (lang) {
            i18n.changeLanguage(lang);
            localStorage.setItem('i18nextLng', lang); // <-- 💾 Guarda el idioma manualmente
        }
        setAnchorEl(null);
    };

    return (
        <Paper elevation={3} sx={{ bgcolor: 'white', borderRadius: 1, p: 0.01 }}>
            <Box>
                <IconButton onClick={handleClick}>
                    <LanguageIcon />
                </IconButton>
                <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={() => handleClose()}
                    MenuListProps={{
                        sx: { backgroundColor: 'white' },
                    }}
                >
                    <MenuItem onClick={() => handleClose('es')}>
                        <img src={EsFlag} alt="Español" width={24} style={{ marginRight: 8 }} />
                        Español
                    </MenuItem>
                    <MenuItem onClick={() => handleClose('en')}>
                        <img src={EnFlag} alt="English" width={24} style={{ marginRight: 8 }} />
                        English
                    </MenuItem>
                </Menu>
            </Box>
        </Paper>
    );
};

export default LanguageSwitcher;
