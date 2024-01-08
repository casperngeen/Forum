import { Box, Typography } from '@mui/material'
import { ReplyType } from '../interfaces/reply';

interface replyProp {
  reply: ReplyType
}

// renders a single reply (be it nested or not)
export default function Reply({ reply }: replyProp) {
  const {username, content, created_at} = reply;

  return (
    <Box display="flex" flexDirection="column" paddingY={3} columnGap={2}>  
        <Typography variant="subtitle1">By ${username}, created at ${created_at.toString()}</Typography>
        <Typography variant="body1">${content}</Typography>
    </Box>
)
}
