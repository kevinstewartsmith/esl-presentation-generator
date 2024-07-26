import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import Image from "next/image";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Link from "next/link";

export default function LessonCard({ deleteLesson, lesson }) {
  const lessonId = lesson.id;
  console.log(lesson);
  return (
    <Link href={`/dashboard/lesson/${lessonId}`}>
      <Card
        sx={{ maxWidth: 345, borderRadius: 3 }}
        onClick={() => console.log(lessonId["title"])}
      >
        <CardActionArea>
          <CardMedia
            component="img"
            height="140"
            image="https://images.unsplash.com/photo-1514037673804-5d655caba9a4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1MjU5MDR8MHwxfHNlYXJjaHw2fHxsaXphcmR8ZW58MHx8fHwxNzIxOTU5OTI4fDA&ixlib=rb-4.0.3&q=80&w=1080"
            alt="green iguana"
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div"></Typography>
            <Typography variant="body2" sx={{ color: "black" }}>
              {lessonId["title"]}
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions>
          <Button
            size="small"
            color="primary"
            onClick={() => deleteLesson(lessonId)}
          >
            Delete
          </Button>
          <Button size="small" style={{ right: 0 }}>
            <MoreVertIcon fontSize="small" color="black" />
          </Button>
        </CardActions>
      </Card>
    </Link>
  );
}
