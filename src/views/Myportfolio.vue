<template>
  <main class="myportfolio">
    <PortfolioHeader />

    <section class="myportfolio-details" aria-labelledby="details-title">
      <div class="myportfolio-header-grid" aria-hidden="true"></div>

      <div
        class="myportfolio-header-glow myportfolio-header-glow-bottom"
        aria-hidden="true"
      ></div>

      <v-container class="myportfolio-content">
        <header class="myportfolio-section-heading">
          <p class="myportfolio-eyebrow">BEYOND THE CODE</p>
          <h2 id="details-title">A little more about me</h2>
          <p>What I enjoy outside of work.</p>
        </header>

        <div class="myportfolio-sections">
          <Education />
          <Favorite />
        </div>
      </v-container>

      <!-- <footer class="about-footer">
        <div class="about-footer-inner">
          <p class="about-footer-copyright">
            © 2026 Phatcharaporn Nilphong
          </p>
        </div>
      </footer> -->
    </section>
  </main>
</template>

<script>
import PortfolioHeader from "@/components/PortfolioHeader.vue";
import Education from "@/components/Education.vue";
import Favorite from "@/components/Favorite.vue";

export default {
  name: "Myportfolio",

  components: {
    PortfolioHeader,
    Education,
    Favorite,
  },
};
</script>

<style src="../assets/css/mainport.css"></style>
