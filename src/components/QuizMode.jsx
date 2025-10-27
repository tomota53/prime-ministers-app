import { useState } from 'react';
import { Check, X, RotateCcw, Trophy, ArrowRight, Star, Users } from 'lucide-react';
import { generateQuizSet } from '../utils/quizUtils';
import useLocalStorage from '../hooks/useLocalStorage';
import allPrimeMinistersData from '../data/allprimeministers.json';

const QuizMode = ({ primeMinistersData }) => {
  // データモード選択
  const [dataMode, setDataMode] = useState('important'); // 'important' or 'all'
  
  // クイズの状態
  const [quizState, setQuizState] = useState('setup'); // setup, playing, result
  const [quizConfig, setQuizConfig] = useState({
    type: 'name',
    questionCount: 10,
    frequency: 'all'
  });
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);
  
  // クイズ履歴をLocalStorageに保存
  const [quizHistory, setQuizHistory] = useLocalStorage('quizHistory', []);

  // クイズ開始
  const startQuiz = () => {
    const currentData = dataMode === 'important' ? primeMinistersData : allPrimeMinistersData;
    const generatedQuestions = generateQuizSet(
      currentData,
      quizConfig.type,
      quizConfig.questionCount,
      quizConfig.frequency
    );
    setQuestions(generatedQuestions);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setQuizState('playing');
    
    // 最初の問題が順序当ての場合、初期化
    if (generatedQuestions[0] && generatedQuestions[0].type === 'order') {
      setOrderAnswer([...generatedQuestions[0].primeMinistersList]);
    }
  };

  // 順序当てクイズ用の状態
  const [orderAnswer, setOrderAnswer] = useState([]);
  
  // 解答を選択
  const handleAnswerSelect = (answer) => {
    if (showFeedback) return; // フィードバック表示中は選択不可
    
    setSelectedAnswer(answer);
    setShowFeedback(true);
    
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = answer === currentQuestion.correctAnswer;
    
    // 解答を記録
    setAnswers([...answers, {
      question: currentQuestion,
      selectedAnswer: answer,
      isCorrect
    }]);
  };

  // 順序当てクイズの並び替え
  const moveOrderItem = (index, direction) => {
    if (showFeedback) return;
    
    const newOrder = [...orderAnswer];
    const newIndex = index + direction;
    
    if (newIndex < 0 || newIndex >= newOrder.length) return;
    
    [newOrder[index], newOrder[newIndex]] = [newOrder[newIndex], newOrder[index]];
    setOrderAnswer(newOrder);
  };

  // 順序当てクイズの解答確定
  const submitOrderAnswer = () => {
    const currentQuestion = questions[currentQuestionIndex];
    const userOrder = orderAnswer.map(pm => pm.id).join(',');
    const correctOrder = currentQuestion.correctOrder.join(',');
    const isCorrect = userOrder === correctOrder;
    
    setShowFeedback(true);
    setAnswers([...answers, {
      question: currentQuestion,
      selectedAnswer: userOrder,
      isCorrect
    }]);
  };

  // 次の問題へ
  const goToNextQuestion = () => {
    setShowFeedback(false);
    setSelectedAnswer(null);
    
    if (currentQuestionIndex < questions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      
      // 次の問題が順序当ての場合、初期化
      if (questions[nextIndex].type === 'order') {
        setOrderAnswer([...questions[nextIndex].primeMinistersList]);
      }
    } else {
      // クイズ終了
      finishQuiz();
    }
  };

  // クイズ終了
  const finishQuiz = () => {
    const correctCount = answers.filter(a => a.isCorrect).length + 
                        (selectedAnswer === questions[currentQuestionIndex].correctAnswer ? 1 : 0);
    const totalCount = questions.length;
    const score = Math.round((correctCount / totalCount) * 100);
    
    // 履歴に保存
    const result = {
      date: new Date().toISOString(),
      type: quizConfig.type,
      questionCount: totalCount,
      correctCount,
      score,
      frequency: quizConfig.frequency
    };
    
    setQuizHistory([result, ...quizHistory].slice(0, 10)); // 最新10件を保持
    setQuizState('result');
  };

  // クイズをリセット
  const resetQuiz = () => {
    setQuizState('setup');
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setAnswers([]);
    setShowFeedback(false);
  };

  // スコアに応じたメッセージ
  const getScoreMessage = (score) => {
    if (score >= 90) return { emoji: '🎉', text: '完璧です！', color: 'text-yellow-600' };
    if (score >= 70) return { emoji: '😊', text: 'よくできました！', color: 'text-green-600' };
    if (score >= 50) return { emoji: '👍', text: 'もう少しです！', color: 'text-blue-600' };
    return { emoji: '💪', text: '復習しましょう！', color: 'text-orange-600' };
  };

  // セットアップ画面
  if (quizState === 'setup') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* データモード切替タブ */}
        <div className="mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setDataMode('important')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                dataMode === 'important'
                  ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Star size={16} />
              重要7首相
            </button>
            <button
              onClick={() => setDataMode('all')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                dataMode === 'all'
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Users size={16} />
              主要33首相
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">🎯</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              クイズモード
            </h2>
            <p className="text-gray-600">
              設定を選んでクイズを始めましょう
            </p>
          </div>

          {/* クイズタイプ選択 */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              クイズタイプ
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'name', label: '名前当て', desc: '功績から首相名を選択' },
                { id: 'achievement', label: '功績当て', desc: '首相から功績を選択' },
                { id: 'order', label: '順序当て', desc: '在任順に並び替え' },
                { id: 'mixed', label: 'ミックス', desc: '全タイプから出題' }
              ].map(type => (
                <button
                  key={type.id}
                  onClick={() => setQuizConfig({ ...quizConfig, type: type.id })}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    quizConfig.type === type.id
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-semibold text-gray-900">{type.label}</div>
                  <div className="text-xs text-gray-600 mt-1">{type.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 問題数選択 */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              問題数
            </label>
            <div className="flex gap-3">
              {[5, 10, 20].map(count => (
                <button
                  key={count}
                  onClick={() => setQuizConfig({ ...quizConfig, questionCount: count })}
                  className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
                    quizConfig.questionCount === count
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {count}問
                </button>
              ))}
            </div>
          </div>

          {/* 頻出度フィルター */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              出題範囲
            </label>
            <div className="flex gap-3">
              {[
                { id: 'all', label: 'すべて' },
                { id: 'high', label: '頻出のみ' }
              ].map(freq => (
                <button
                  key={freq.id}
                  onClick={() => setQuizConfig({ ...quizConfig, frequency: freq.id })}
                  className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
                    quizConfig.frequency === freq.id
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {freq.label}
                </button>
              ))}
            </div>
          </div>

          {/* 開始ボタン */}
          <button
            onClick={startQuiz}
            className="w-full py-4 bg-blue-600 text-white rounded-lg font-bold text-lg hover:bg-blue-700 transition-colors shadow-md flex items-center justify-center gap-2"
          >
            クイズを始める
            <ArrowRight size={24} />
          </button>
        </div>
      </div>
    );
  }

  // クイズプレイ画面
  if (quizState === 'playing' && questions.length > 0) {
    const currentQuestion = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* プログレスバー */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-700">
              問題 {currentQuestionIndex + 1} / {questions.length}
            </span>
            <span className="text-sm text-gray-600">
              正解: {answers.filter(a => a.isCorrect).length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* 問題カード */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="mb-6">
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4">
              {currentQuestion.type === 'name' ? '名前当て' :
               currentQuestion.type === 'achievement' ? '功績当て' : '順序当て'}
            </span>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {currentQuestion.question}
            </h3>
            {currentQuestion.hint && (
              <p className="text-sm text-gray-600">
                💡 ヒント: {currentQuestion.hint}
              </p>
            )}
          </div>

          {/* 選択肢 */}
          {currentQuestion.type === 'order' ? (
            // 順序当てクイズのUI
            <div>
              <div className="space-y-3 mb-4">
                {orderAnswer.map((pm, index) => (
                  <div
                    key={pm.id}
                    className={`p-4 rounded-lg border-2 ${
                      showFeedback
                        ? currentQuestion.correctOrder[index] === pm.id
                          ? 'border-green-500 bg-green-50'
                          : 'border-red-500 bg-red-50'
                        : 'border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-bold text-gray-900">
                          {index + 1}. {pm.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {pm.order} ({pm.termStart}年〜{pm.termEnd}年)
                        </div>
                      </div>
                      {!showFeedback && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => moveOrderItem(index, -1)}
                            disabled={index === 0}
                            className="px-3 py-1 bg-blue-100 text-blue-700 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            ↑
                          </button>
                          <button
                            onClick={() => moveOrderItem(index, 1)}
                            disabled={index === orderAnswer.length - 1}
                            className="px-3 py-1 bg-blue-100 text-blue-700 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            ↓
                          </button>
                        </div>
                      )}
                      {showFeedback && (
                        <span>
                          {currentQuestion.correctOrder[index] === pm.id ? (
                            <Check size={24} className="text-green-600" />
                          ) : (
                            <X size={24} className="text-red-600" />
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              {!showFeedback && (
                <button
                  onClick={submitOrderAnswer}
                  className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors"
                >
                  解答する
                </button>
              )}
            </div>
          ) : (
            // 名前当て・功績当てクイズのUI
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => {
                const isSelected = selectedAnswer === option;
                const isCorrect = option === currentQuestion.correctAnswer;
                const showResult = showFeedback && (isSelected || isCorrect);
                
                let buttonClass = 'w-full p-4 rounded-lg border-2 text-left font-semibold transition-all ';
                
                if (showResult) {
                  if (isCorrect) {
                    buttonClass += 'border-green-500 bg-green-50 text-green-700';
                  } else if (isSelected) {
                    buttonClass += 'border-red-500 bg-red-50 text-red-700';
                  }
                } else {
                  buttonClass += 'border-gray-200 hover:border-blue-500 hover:bg-blue-50';
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(option)}
                    disabled={showFeedback}
                    className={buttonClass}
                  >
                    <div className="flex items-center justify-between">
                      <span>{option}</span>
                      {showResult && (
                        <span>
                          {isCorrect ? (
                            <Check size={24} className="text-green-600" />
                          ) : isSelected ? (
                            <X size={24} className="text-red-600" />
                          ) : null}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* フィードバック */}
          {showFeedback && currentQuestion.type !== 'order' && (
            <div className={`mt-6 p-4 rounded-lg ${
              selectedAnswer === currentQuestion.correctAnswer
                ? 'bg-green-50 border-2 border-green-500'
                : 'bg-red-50 border-2 border-red-500'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                {selectedAnswer === currentQuestion.correctAnswer ? (
                  <>
                    <Check size={24} className="text-green-600" />
                    <span className="font-bold text-green-700">正解！</span>
                  </>
                ) : (
                  <>
                    <X size={24} className="text-red-600" />
                    <span className="font-bold text-red-700">不正解</span>
                  </>
                )}
              </div>
              {currentQuestion.primeMinister && (
                <p className="text-sm text-gray-700">
                  {currentQuestion.primeMinister.name}
                  （{currentQuestion.primeMinister.order}）
                </p>
              )}
            </div>
          )}
          
          {/* 順序当てクイズのフィードバック */}
          {showFeedback && currentQuestion.type === 'order' && (
            <div className={`mt-6 p-4 rounded-lg ${
              answers[answers.length - 1]?.isCorrect
                ? 'bg-green-50 border-2 border-green-500'
                : 'bg-red-50 border-2 border-red-500'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                {answers[answers.length - 1]?.isCorrect ? (
                  <>
                    <Check size={24} className="text-green-600" />
                    <span className="font-bold text-green-700">正解！</span>
                  </>
                ) : (
                  <>
                    <X size={24} className="text-red-600" />
                    <span className="font-bold text-red-700">不正解</span>
                  </>
                )}
              </div>
              <p className="text-sm text-gray-700">
                正しい順序は在任の古い順です
              </p>
            </div>
          )}
        </div>

        {/* 次へボタン */}
        {showFeedback && (
          <button
            onClick={goToNextQuestion}
            className="w-full py-4 bg-blue-600 text-white rounded-lg font-bold text-lg hover:bg-blue-700 transition-colors shadow-md"
          >
            {currentQuestionIndex < questions.length - 1 ? '次の問題へ' : '結果を見る'}
          </button>
        )}
      </div>
    );
  }

  // 結果画面
  if (quizState === 'result') {
    const allAnswers = [...answers];
    if (selectedAnswer) {
      allAnswers.push({
        question: questions[currentQuestionIndex],
        selectedAnswer,
        isCorrect: selectedAnswer === questions[currentQuestionIndex].correctAnswer
      });
    }
    
    const correctCount = allAnswers.filter(a => a.isCorrect).length;
    const totalCount = questions.length;
    const score = Math.round((correctCount / totalCount) * 100);
    const scoreMessage = getScoreMessage(score);
    const wrongAnswers = allAnswers.filter(a => !a.isCorrect);

    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          {/* スコア表示 */}
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">{scoreMessage.emoji}</div>
            <h2 className={`text-3xl font-bold mb-2 ${scoreMessage.color}`}>
              {scoreMessage.text}
            </h2>
            <div className="text-5xl font-bold text-gray-900 mb-2">
              {score}点
            </div>
            <p className="text-gray-600">
              {correctCount} / {totalCount} 問正解
            </p>
          </div>

          {/* 統計 */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{totalCount}</div>
              <div className="text-sm text-gray-600">出題数</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{correctCount}</div>
              <div className="text-sm text-gray-600">正解</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{wrongAnswers.length}</div>
              <div className="text-sm text-gray-600">不正解</div>
            </div>
          </div>

          {/* 間違えた問題 */}
          {wrongAnswers.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                復習が必要な首相
              </h3>
              <div className="space-y-2">
                {wrongAnswers.map((answer, index) => (
                  <div key={index} className="p-3 bg-red-50 rounded-lg border border-red-200">
                    <div className="font-semibold text-gray-900 mb-1">
                      {answer.question.question}
                    </div>
                    <div className="text-sm text-gray-600">
                      正解: {answer.question.correctAnswer}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* アクションボタン */}
          <div className="flex gap-4">
            <button
              onClick={resetQuiz}
              className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw size={20} />
              もう一度
            </button>
            <button
              onClick={resetQuiz}
              className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <Trophy size={20} />
              新しいクイズ
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default QuizMode;
