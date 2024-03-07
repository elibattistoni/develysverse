import { Container, Text, Title, rem } from "@mantine/core";
import classes from "./HomePage.module.css";
// import imgUrl from "./assets/elisa.png";
// <img src={imgUrl} alt="Elisa" />
import {
  InstagramLogoIcon,
  LinkedInLogoIcon,
  GitHubLogoIcon,
} from "@radix-ui/react-icons";

const HomePage = () => {
  return (
    <Container fluid className={classes.container}>
      <Title order={2} className={classes.title}>
        Elisa Battistoni
      </Title>
      <div className={classes.gradient}></div>
      <div className={classes.image}></div>
      <div className={classes.subtitle}>
        <div>
          <Text fz={{ base: rem(20) }}>Frontend Developer & Web Designer</Text>
          <Text fz={{ base: rem(20) }}>Ph.D. in Cognitive Neuroscience</Text>
        </div>
        <div className={classes.contactsIconsContainer}>
          <div className={classes.iconContainer}>
            <a href="https://www.instagram.com/develysverse/" target="_blank">
              <InstagramLogoIcon className={classes.icon} />
              <Text fz={{ base: rem(12) }} c="text.1">
                Instagram
              </Text>
            </a>
          </div>
          <div className={classes.iconContainer}>
            <a
              href="https://www.linkedin.com/in/elisa-battistoni-21597980/"
              target="_blank"
            >
              <LinkedInLogoIcon className={classes.icon} />
              <Text fz={{ base: rem(12) }} c="text.1">
                Linkedin
              </Text>
            </a>
          </div>
          <div className={classes.iconContainer}>
            <a href="https://github.com/elibattistoni" target="_blank">
              <GitHubLogoIcon className={classes.icon} />
              <Text fz={{ base: rem(12) }} c="text.1">
                Github
              </Text>
            </a>
          </div>
        </div>
        <Text>e.b.battistoni@gmail.com</Text>
        <Text className={classes.construction}>Page under construction</Text>
      </div>
    </Container>
  );
};

export default HomePage;
