import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';

export default function BlogPostPreviewCard({ post }) {
  // Constructing the post URL
  const postUrl = `/blog/${post._id}`;

  // Formating the created date
  const formattedDate = new Date(post.dateCreated).toLocaleDateString();

  // Extracting the preview text from the post's article.
  const previewText = `${post.article.split(' ').slice(0, 60).join(' ')}...`;

  return (
    <Card>
      <CardActionArea href={postUrl}>
        <CardContent>
          <Typography variant="h5" component="div">
            {post.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <p>Written on: <em>{formattedDate}</em></p>
            <p>By: <em>{post.author.name}</em></p>
            {previewText}
          </Typography>
          <Typography variant="body2" color="primary">
            Read More
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
