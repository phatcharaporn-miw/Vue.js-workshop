<template>
  <section class="portfolio-header">
    <div class="portfolio-header-grid" aria-hidden="true"></div>
    <div
      class="portfolio-header-glow portfolio-header-glow-top"
      aria-hidden="true"
    ></div>
    <div
      class="portfolio-header-glow portfolio-header-glow-bottom"
      aria-hidden="true"
    ></div>

    <v-container class="portfolio-header-container">
      <v-row align="center" class="portfolio-header-row">
        <v-col cols="12" md="7" class="portfolio-header-copy">
          <div class="portfolio-header-intro">
            <h1 class="portfolio-header-title">
              <span class="portfolio-header-title-first">
                <span class="portfolio-header-greeting">Hi, I'm </span>
                <span class="portfolio-header-name">Phatcharaporn</span>
              </span>
              <span class="portfolio-header-surname">Nilphong</span>
            </h1>

            <div class="about-nickname">
              <span class="about-nickname-dot" aria-hidden="true"></span>
              <span>Miew</span>
            </div>
          </div>

          <div class="portfolio-header-about">
            <h2 class="portfolio-header-about-title">About me</h2>
            <p class="portfolio-header-about-text">
              Hello! I'm an Information Technology graduate from Khon Kaen
              University. I'm interested in web development, UI design, and
              learning new technologies.
            </p>
          </div>
        </v-col>

        <v-col cols="12" md="5" class="portfolio-header-portrait-column">
          <div class="portfolio-header-portrait">
            <span
              class="portfolio-header-portrait-block"
              aria-hidden="true"
            ></span>
            <v-img
              :src="profileImage"
              alt="Portrait of Phatcharaporn Nilphong"
              aspect-ratio="0.7"
              class="portfolio-header-image"
              cover
            />
          </div>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<script setup>
import profileImage from "../assets/Miw.jpg";
</script>

<style src="../assets/css/myport.css"></style>
