
<template>
  <section class="about-grid">
      <div class="about-card about-card-dark">
        <span class="about-icon">
          <v-icon size="24">mdi-school</v-icon>
        </span>
        <p class="about-label about-label-accent">Education</p>
        <h2 class="about-card-title about-card-title-lg">B.S. Information Technology</h2>
        <p class="about-card-text">
          College of Computing<br />
          Khon Kaen University
        </p>
        <span class="about-tag">Bachelor's Degree</span>
      </div>
 
      <div class="about-card about-card-soft">
        <p class="about-label">Hobbies</p>
        <h2 class="about-card-title about-card-title-lg">What I do for fun</h2>
        <ul class="about-hobbies">
          <li v-for="h in hobbies" :key="h.label">
            <v-icon size="24">{{ h.icon }}</v-icon>
            <span>{{ h.label }}</span>
          </li>
        </ul>
      </div>
    </section>
</template>

<script>
export default {
  name: 'Education',
  data() {
    return {
      hobbies: [
        { label: 'Reading', icon: 'mdi-book-open-page-variant' },
        { label: 'Painting', icon: 'mdi-palette' },
        { label: 'Music', icon: 'mdi-music' },
        { label: 'Movie', icon: 'mdi-movie' },
      ],
    }
  },
}
</script>

<style src="../assets/css/educate.css"></style>