/**
 * クイズ生成ユーティリティ関数
 */

/**
 * 配列からランダムに要素を取得
 */
export const getRandomItems = (array, count) => {
  const shuffled = [...array].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

/**
 * 配列からランダムに1つの要素を取得（除外リスト付き）
 */
export const getRandomItem = (array, exclude = []) => {
  const filtered = array.filter(item => !exclude.includes(item));
  return filtered[Math.floor(Math.random() * filtered.length)];
};

/**
 * 名前当てクイズの問題を生成
 */
export const generateNameQuiz = (primeMinistersData, count = 10) => {
  const selected = getRandomItems(primeMinistersData, count);
  
  return selected.map(pm => {
    // 功績からランダムに1つ選択
    const achievement = pm.achievements[Math.floor(Math.random() * pm.achievements.length)];
    
    // 選択肢を生成（正解 + 3つの不正解）
    const wrongOptions = getRandomItems(
      primeMinistersData.filter(p => p.id !== pm.id),
      3
    );
    
    const options = [...wrongOptions.map(p => p.name), pm.name]
      .sort(() => Math.random() - 0.5);
    
    return {
      type: 'name',
      question: `「${achievement}」を行ったのは誰でしょう？`,
      options,
      correctAnswer: pm.name,
      primeMinister: pm,
      hint: `${pm.order}、${pm.termStart}年〜${pm.termEnd}年`
    };
  });
};

/**
 * 功績当てクイズの問題を生成
 */
export const generateAchievementQuiz = (primeMinistersData, count = 10) => {
  const selected = getRandomItems(primeMinistersData, count);
  
  return selected.map(pm => {
    // この首相の正しい功績
    const correctAchievement = pm.achievements[Math.floor(Math.random() * pm.achievements.length)];
    
    // 他の首相の功績から3つ選択
    const wrongAchievements = [];
    while (wrongAchievements.length < 3) {
      const randomPM = getRandomItem(primeMinistersData, [pm]);
      const randomAchievement = randomPM.achievements[
        Math.floor(Math.random() * randomPM.achievements.length)
      ];
      if (!wrongAchievements.includes(randomAchievement)) {
        wrongAchievements.push(randomAchievement);
      }
    }
    
    const options = [...wrongAchievements, correctAchievement]
      .sort(() => Math.random() - 0.5);
    
    return {
      type: 'achievement',
      question: `${pm.name}の主な功績はどれでしょう？`,
      options,
      correctAnswer: correctAchievement,
      primeMinister: pm,
      hint: `${pm.order}、${pm.party}`
    };
  });
};

/**
 * 順序当てクイズの問題を生成
 */
export const generateOrderQuiz = (primeMinistersData, count = 5) => {
  const quizzes = [];
  
  for (let i = 0; i < count; i++) {
    // 3人の首相を選択
    const selected = getRandomItems(primeMinistersData, 3);
    
    // 在任開始年でソート（正解）
    const correctOrder = [...selected].sort((a, b) => a.termStart - b.termStart);
    
    // シャッフルした選択肢
    const shuffledOptions = [...selected].sort(() => Math.random() - 0.5);
    
    quizzes.push({
      type: 'order',
      question: '次の首相を在任が古い順に並べてください',
      primeMinistersList: shuffledOptions,
      correctOrder: correctOrder.map(pm => pm.id),
      hint: '在任期間をヒントにしてください'
    });
  }
  
  return quizzes;
};

/**
 * クイズセットを生成
 */
export const generateQuizSet = (primeMinistersData, quizType, questionCount, frequency = 'all') => {
  // 頻出度でフィルター
  let filtered = primeMinistersData;
  if (frequency === 'high') {
    filtered = primeMinistersData.filter(pm => pm.examFrequency === 'high');
  }
  
  switch (quizType) {
    case 'name':
      return generateNameQuiz(filtered, questionCount);
    case 'achievement':
      return generateAchievementQuiz(filtered, questionCount);
    case 'order':
      return generateOrderQuiz(filtered, Math.min(questionCount, 10)); // 順序問題は最大10問
    case 'mixed':
      // ミックス：各タイプから均等に
      const nameCount = Math.floor(questionCount / 3);
      const achievementCount = Math.floor(questionCount / 3);
      const orderCount = questionCount - nameCount - achievementCount;
      
      return [
        ...generateNameQuiz(filtered, nameCount),
        ...generateAchievementQuiz(filtered, achievementCount),
        ...generateOrderQuiz(filtered, Math.max(1, Math.floor(orderCount / 3)))
      ].sort(() => Math.random() - 0.5);
    default:
      return generateNameQuiz(filtered, questionCount);
  }
};
