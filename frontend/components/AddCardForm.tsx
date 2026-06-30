'use client';

import { useState, memo } from 'react';
import { Button, TextField, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

interface AddCardFormProps {
  onAdd: (title: string, details: string) => void;
}

function AddCardForm({ onAdd }: AddCardFormProps) {
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd(title.trim(), details.trim());
      setTitle('');
      setDetails('');
      setIsOpen(false);
    }
  };

  if (!isOpen) {
    return (
      <Button
        fullWidth
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={() => setIsOpen(true)}
        sx={{
          borderColor: '#fd7e14',
          color: '#fd7e14',
          borderStyle: 'dashed',
          '&:hover': {
            borderColor: '#e96f08',
            backgroundColor: 'rgba(253, 126, 20, 0.08)',
          },
        }}
      >
        Add Card
      </Button>
    );
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        bgcolor: '#060813',
        border: '1px solid #2a2b38',
        borderRadius: 2,
        p: 2,
        boxShadow: 1,
      }}
    >
      <TextField
        fullWidth
        size="small"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Card title"
        autoFocus
        sx={{ mb: 1.5 }}
      />
      <TextField
        fullWidth
        multiline
        rows={3}
        size="small"
        value={details}
        onChange={(e) => setDetails(e.target.value)}
        placeholder="Card details"
        sx={{ mb: 2 }}
      />
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{
            bgcolor: '#fd7e14',
            color: '#060813',
            fontWeight: 600,
            '&:hover': { bgcolor: '#e96f08' },
          }}
        >
          Add Card
        </Button>
        <Button
          type="button"
          variant="outlined"
          onClick={() => {
            setIsOpen(false);
            setTitle('');
            setDetails('');
          }}
          sx={{ color: '#667085', borderColor: '#2a2b38' }}
        >
          Cancel
        </Button>
      </Box>
    </Box>
  );
}

export default memo(AddCardForm);
