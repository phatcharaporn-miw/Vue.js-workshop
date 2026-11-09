<template>
  <div>
    <section class="about-grid">
      <div class="about-card about-card-outline">
        <h2 class="about-card-title">Things I like</h2>
        <ul class="about-list">
          <li v-for="item in likes" :key="item">
            <v-icon size="22">mdi-check</v-icon>
            <span>{{ item }}</span>
          </li>
        </ul>
      </div>

      <div class="about-card about-card-outline">
        <h2 class="about-card-title">Things I don't like</h2>
        <ul class="about-list about-list-muted">
          <li v-for="item in dislikes" :key="item">
            <v-icon size="22">mdi-close</v-icon>
            <span>{{ item }}</span>
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: "Favorites",

  data() {
    return {
      likes: [
        "Listening to music",
        "Watching movies",
        "Eating delicious food",
        "Sleeping",
        "Going out with friends",
        "Playing games",
      ],

      dislikes: [
        "Hot weather",
        "Traffic jams",
        "Waiting for a long time",
        "Loud noises",
        "Rainy days",
        "Dirty rooms",
      ],
    };
  },
};
</script>

<style src="../assets/css/fav.css"></style>
