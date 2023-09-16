import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardActionArea';
import CardMedia from '@mui/material/CardActionArea';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import sendRequest from '../../utilities/send-request';
import { useEffect, useState } from 'react';

export default function EssayPreviewCard({ essay }) {
    const [signedURL, setSignedURL] = useState(null);
    //console.log(essay);
    useEffect(() => {
        async function fetchSignedURL() {
          if(essay.coverPhotoS3Key && essay.coverPhotoS3Key !== 'undefined'){
            try {
                const response = await sendRequest(`/api/essays/image-url/${essay.coverPhotoS3Key}`);
                if (response.status === 200) {
                    const data = response;
                    setSignedURL(data.signedURL);
                }
            } catch (error) {
                console.error("Error fetching signed URL:", error);
            }
          }
        }
        fetchSignedURL();
    }, []);
    return (
        <Card>
          {signedURL && <CardMedia
            component="img"
            height="140"
            image={signedURL}
            alt="Cover Image"
          />}
          <CardContent>
            <Typography variant="h5" component="div">
              {essay.title}
            </Typography>
            {/* Display a snippet of the essay content. Adjust as needed. */}
            <Typography variant="body2" color="text.secondary">
                <span dangerouslySetInnerHTML={{ __html: essay.bodyText.slice(0, 100) + '...' }} />
            </Typography>
          </CardContent>
          {/* Optional buttons */}
          <Button href={`/essays/${essay._id}`} variant="contained" color="primary">Read More</Button>
          {/* Add more buttons for edit, delete, etc. as needed */}
        </Card>
      );
}
