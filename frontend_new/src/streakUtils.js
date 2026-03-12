export const updateStreak = () => {
  const now = new Date();
  const todayStr = now.toDateString();
  
  const savedData = localStorage.getItem('streak_data');
  let data = savedData ? JSON.parse(savedData) : { count: 0, lastDate: null };

  if (data.lastDate === todayStr) {
    
    return data;
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toDateString();

  if (data.lastDate === yesterdayStr) {
   
    data.count += 1;
  } else if (data.lastDate === null || data.lastDate !== todayStr) {
    
    data.count = 1;
  }

  data.lastDate = todayStr;
  localStorage.setItem('streak_data', JSON.stringify(data));
  return data;
};

export const getStreakBadge = (count) => {
  if (count >= 30) return { label: "Consistent Legend", color: "#6366f1" };
  if (count >= 7) return { label: "Weekly Warrior", color: "#22c55e" };
  if (count >= 3) return { label: "Momentum Builder", color: "#f59e0b" };
  return null;
};