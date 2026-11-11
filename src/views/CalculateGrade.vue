
<template>
  <div class="grade-page">
    <div class="grade-card">

      <h1 class="header">คำนวณเกรด</h1>

      <div class="form-group">
        <label>คะแนนของคุณ</label>

        <v-text-field
          v-model="scoreInput"
          type="text"
          placeholder="กรอกคะแนน 0-100"
          variant="outlined"
          hide-details
          class="score-input-garde"
        />
      </div>

      <v-btn
        class="calculate-btn"
        block
        size="large"
        @click="calculateGrade()"
      >
        คำนวณเกรด
      </v-btn>

      <div v-if="gradeResult" class="result">
        <p class="result-label">เกรดของคุณคือ</p>
        <h2 class="grade">{{ gradeResult }}</h2>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      scoreInput: "",
      gradeResult: "",
    };
  },
  methods: {
    calculateGrade() {
      this.gradeResult = "";

      if (this.scoreInput.trim() === "" || isNaN(this.scoreInput)) {
        this.$toast("กรุณากรอกคะแนนเป็นตัวเลขเท่านั้น", "error");
        return;
      }

      const score = this.scoreInput;

      if (score < 0 || score > 100) {
        this.$toast("คะแนนต้องอยู่ระหว่างช่วง 0 - 100 เท่านั้น", "error");
        return;
      }

      if (score >= 80 && score <= 100) {
        this.gradeResult = "A";
      } else if (score >= 70 && score <= 79) {
        this.gradeResult = "B";
      } else if (score >= 60 && score <= 69) {
        this.gradeResult = "C";
      } else if (score >= 50 && score <= 59) {
        this.gradeResult = "D";
      } else if (score >= 0 && score <= 49) {
        this.gradeResult = "F";
      }

      this.$toast(`คำนวณเกรดสำเร็จ: ${this.gradeResult}`, "success");
    },
  },
};
</script>

<style scoped>
.grade-page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px;
  background: linear-gradient(
    135deg,
    #f5f3ff,
    #ede9fe,
    #e0e7ff
  );
}

.grade-card {
  width: 100%;
  max-width: 440px;
  box-sizing: border-box;
  padding: clamp(24px, 5vw, 36px) clamp(20px, 5vw, 30px);
  background: white;
  border-radius: 24px;
  text-align: center;
}

.header {
  color: #312e81;
  font-size: clamp(28px, 6vw, 40px);
  font-weight: 700;
  margin-bottom: 8px;
}

.form-group {
  text-align: left;
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  color: #374151;
  font-weight: 600;
  margin-bottom: 10px;
}

.score-input-garde {
  border-radius: 12px;
}

.calculate-btn {
  background: linear-gradient(
    135deg,
    #8b5cf6,
    #6d28d9
  );
  color: white;
  border-radius: 12px;
  font-weight: 600;
}

.result {
  margin-top: 26px;
  padding: 22px;
  border-radius: 16px;
  background: #f5f3ff;
  animation: fadeIn 0.3s ease;
}

.result-label {
  color: #6d28d9;
  font-size: 14px;
}

.grade {
  color: #7c3aed;
  font-size: 48px;
  font-weight: 800;
  margin: 8px 0;
}

</style>
