import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import sendRequest from '../../utilities/send-request';
import { useEffect, useState } from 'react';
import './EssayPreviewCard.css'


export default function EssayPreviewCard({ essay }) {
  const [signedURL, setSignedURL] = useState(null);
  useEffect(() => {
      async function fetchSignedURL() {
        if(essay.coverPhotoS3Key && essay.coverPhotoS3Key !== 'undefined'){
          try {
              const response = await sendRequest(`/api/essays/image-url/${essay._id}`);
              if (response) {
                  setSignedURL(response.signedURL);
              }
          } catch (error) {
              console.error("Error fetching signed URL:", error);
          }
        }
      }
      fetchSignedURL();
  }, []);

  const essayPath = essay.isMain ? "/read" : `/side-essays/${essay._id}`;

  return (
      <Card sx={{backgroundColor: '#A3B18A'}}>
          <CardActionArea href={essayPath} 
            sx={{ 
                display: 'flex',
                justifyContent: 'center',
                alignContent: 'flex-start'
            }}>
              {signedURL && <CardMedia
                  component="img"
                  height="140"
                  image={signedURL}
                  alt="Cover Image"
                  className='essay-cover-image'
                  sx={{
                    width: '10rem',
                    height: '10rem',
                    objectFit: 'cover',
                    objectPosition: 'center'}}
              />}
              <CardContent className='essay-card-body'>
                  <Typography variant="h5" component="div">
                      {essay.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                      <span dangerouslySetInnerHTML={{ __html: essay.bodyText}} />
                  </Typography>
              </CardContent>
          </CardActionArea>
      </Card>
  );
}