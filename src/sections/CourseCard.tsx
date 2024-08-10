import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  CardActions,
  Button,
  Box,
} from "@mui/material";

export const CourseCard = ({ course }) => {
  const { image, name, price, discount } = course;

  return (
    <Card sx={{ maxWidth: 350, height: 450 }}>
      <CardMedia component="img" height="250" image={image} alt={name} />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {name}
        </Typography>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="body2" color="text.secondary">
            Price: ${price}
          </Typography>
          {discount && (
            <Typography variant="body2" color="text.secondary">
              Discount: {discount}%
            </Typography>
          )}
        </Box>
      </CardContent>
      <CardActions>
        <Button size="medium" color="primary">
          View Details
        </Button>
      </CardActions>
    </Card>
  );
};
