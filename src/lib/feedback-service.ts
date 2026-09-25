import {
  Feedback,
  FeedbackCluster,
  ProductInsight,
  FeedbackSentiment,
  FeedbackAIClassification,
  TrendDirection,
  PriorityLevel,
  SentimentDistribution,
} from './types';

// Simple keyword-based sentiment analysis (simulating AI)
export function analyzeSentiment(text: string): FeedbackSentiment {
  const lowerText = text.toLowerCase();

  const positiveKeywords = ['great', 'love', 'excellent', 'amazing', 'happy', 'perfect', 'wonderful',
    'fantastic', 'awesome', 'good', 'nice', 'best', 'easy', 'convenient', 'fast', 'impressed'];
  const negativeKeywords = ['bad', 'hate', 'terrible', 'awful', 'broken', 'crash', 'issue',
    'problem', 'disappointed', 'worst', 'useless', 'slow', 'error', 'fail', 'poor', 'annoying'];

  const positiveCount = positiveKeywords.filter(k => lowerText.includes(k)).length;
  const negativeCount = negativeKeywords.filter(k => lowerText.includes(k)).length;

  if (positiveCount > negativeCount && positiveCount > 0) {
    return 'positive';
  } else if (negativeCount > positiveCount && negativeCount > 0) {
    return 'negative';
  } else {
    return 'neutral';
  }
}

// Classify feedback into categories (simulating AI)
export function classifyFeedback(
  text: string,
): { classification: FeedbackAIClassification; confidence: number; category: string } {
  const lowerText = text.toLowerCase();

  // Bug indicators
  if (['crash', 'broken', 'error', 'fail', 'doesn\'t work', 'not working', 'bug', 'issue', 'problem', 'fix'].some(
    k => lowerText.includes(k),
  )) {
    return { classification: 'bug', confidence: 0.85, category: 'bug' };
  }

  // Performance indicators
  if (['slow', 'lag', 'timeout', 'battery', 'data usage', 'performance', 'speed'].some(
    k => lowerText.includes(k),
  )) {
    return { classification: 'performance', confidence: 0.82, category: 'performance' };
  }

  // UX indicators
  if (['confusing', 'hard to', 'difficult', 'unclear', 'ux', 'ui', 'navigation', 'interface', 'difficult', 'intuitive'].some(
    k => lowerText.includes(k),
  )) {
    return { classification: 'ux', confidence: 0.80, category: 'ux' };
  }

  // Feature request indicators
  if (['please add', 'would like', 'need', 'feature', 'support', 'want', 'implement', 'wish', 'suggest'].some(
    k => lowerText.includes(k),
  )) {
    return { classification: 'feature', confidence: 0.78, category: 'feature' };
  }

  // Positive indicators
  if (['love', 'great', 'amazing', 'excellent', 'perfect', 'wonderful', 'best'].some(
    k => lowerText.includes(k),
  )) {
    return { classification: 'positive', confidence: 0.90, category: 'positive' };
  }

  return { classification: 'other', confidence: 0.5, category: 'other' };
}

// Calculate priority for a group of feedback (e.g. a cluster), with reasoning
export function calculatePriority(feedback: Feedback[]): { priority: PriorityLevel; reasoning: string } {
  const negativeFeedback = feedback.filter(f => f.sentiment === 'negative').length;
  const positiveFeedback = feedback.filter(f => f.sentiment === 'positive').length;
  const totalCount = feedback.length;

  const negativeRatio = totalCount > 0 ? negativeFeedback / totalCount : 0;
  const positiveRatio = totalCount > 0 ? positiveFeedback / totalCount : 0;
  const bugOrCritical = feedback.some(f => f.aiClassification === 'bug' || f.priority === 'critical');

  // A cluster that is mostly positive praise is not something the team needs to
  // act on urgently, regardless of how many reports it contains.
  if (positiveRatio >= 0.6) {
    return {
      priority: 'low',
      reasoning: `${positiveFeedback}/${totalCount} reports are positive - a satisfaction signal, not an actionable problem.`,
    };
  }

  if (bugOrCritical && negativeRatio > 0.5) {
    return {
      priority: 'critical',
      reasoning: `${negativeFeedback}/${totalCount} reports are negative and include bug reports or existing critical items.`,
    };
  }
  if (totalCount >= 10 || negativeRatio > 0.6) {
    return {
      priority: 'high',
      reasoning: `High volume (${totalCount} reports) or high negative sentiment (${Math.round(negativeRatio * 100)}%).`,
    };
  }
  if (totalCount >= 5 || negativeRatio > 0.3) {
    return {
      priority: 'medium',
      reasoning: `Moderate volume (${totalCount} reports) with ${Math.round(negativeRatio * 100)}% negative sentiment.`,
    };
  }
  return { priority: 'low', reasoning: `Low volume (${totalCount} reports) with limited negative sentiment.` };
}

// Detect trends over time by comparing report VOLUME in the most recent window
// against the prior window of equal length (not by averaging raw epoch timestamps,
// which is numerically insensitive to date spreads much smaller than the epoch itself).
export function detectTrend(feedbackDates: number[], now: number = Date.now(), windowMs: number = 604800000): TrendDirection {
  if (feedbackDates.length < 2) {
    return 'stable';
  }

  const recentCount = feedbackDates.filter(d => now - d < windowMs).length;
  const priorCount = feedbackDates.filter(d => now - d >= windowMs && now - d < windowMs * 2).length;

  // Normalize so clusters with very few reports don't flip on 1-item noise
  if (recentCount === priorCount) return 'stable';
  if (priorCount === 0) return recentCount >= 2 ? 'increasing' : 'stable';

  const ratio = recentCount / priorCount;
  if (ratio >= 1.25) return 'increasing';
  if (ratio <= 0.75) return 'decreasing';
  return 'stable';
}

// Cluster similar feedback using simple keyword matching
export function clusterFeedback(feedbacks: Feedback[]): FeedbackCluster[] {
  const clusters: Map<string, Feedback[]> = new Map();

  // Define cluster themes with keywords, ordered from most to least specific
  // (a feedback item lands in the first theme whose keyword it matches).
  const themes: { [key: string]: { keywords: string[]; title: string } } = {
    'payment-checkout': {
      keywords: ['payment', 'stripe', 'billing', 'discount code', 'coupon', 'promo', 'currency', 'checkout', 'cart empt'],
      title: 'Payment, Checkout & Promotions',
    },
    'performance-stability': {
      keywords: ['slow', 'lag', 'timeout', 'battery', 'data usage', 'performance', 'speed', 'crash', 'freeze',
        'broke my workflow', 'duplicate entries', 'stability'],
      title: 'Performance & Stability',
    },
    'dark-mode': {
      keywords: ['dark mode', 'dark theme', 'night', 'bright', 'eyes'],
      title: 'Dark Mode Feature Request',
    },
    'notifications': {
      keywords: ['notification', 'alert', 'email', 'notify', 'back in stock', 'price drop', 'sms', 'newsletter'],
      title: 'Notifications & Alerts',
    },
    'mobile-app': {
      keywords: ['mobile app', 'native app', 'ios', 'android', 'app store', 'google play'],
      title: 'Native Mobile App Request',
    },
    'export-business': {
      keywords: ['export', 'csv', 'report', 'analytics', 'dashboard', 'accounting', 'api rate limit',
        'bulk order', 'b2b', 'bulk edit', 'bulk ordering', 'net payment', 'net terms'],
      title: 'Export, Reporting & Business Features',
    },
    'search-discovery': {
      keywords: ['search', 'find', 'filter', 'discover', 'algorithm', 'recommendation', 'video', 'try-on',
        'augmented reality', 'size guide', 'size chart', 'size comparison'],
      title: 'Search, Discovery & Product Info',
    },
    'support': {
      keywords: ['support', 'help', 'customer service', 'live chat', 'response time'],
      title: 'Support & Help Requests',
    },
    'account-security-trust': {
      keywords: ['password', 'login', 'session', 'two-factor', '2fa', 'social login', 'address book', 'profile',
        'privacy', 'gdpr', 'data protection', 'fake', 'verified purchase'],
      title: 'Account, Security & Trust',
    },
    'wishlist-cart': {
      keywords: ['wishlist', 'share wishlist', 'group buying'],
      title: 'Wishlist & Cart Features',
    },
    'ux-navigation': {
      keywords: ['navigation', 'confusing', 'hard to', 'difficult', 'unclear', 'menu', 'layout', 'interface', 'intuitive',
        'safari', 'firefox', 'tablet', 'screen reader', 'text size', 'browser extension'],
      title: 'UX, Navigation & Compatibility',
    },
    'shipping-returns': {
      keywords: ['shipping', 'delivery', 'tracking', 'track', 'freight', 'order status', 'refund', 'return',
        'exchange', 'money back', 'cancellation'],
      title: 'Shipping, Returns & Refunds',
    },
    'product-catalog': {
      keywords: ['product', 'image', 'description', 'inventory', 'stock', 'out of stock', 'language', 'spanish', 'german'],
      title: 'Product Catalog & Localization',
    },
  };

  // Assign feedback to clusters
  feedbacks.forEach(fb => {
    const text = fb.text.toLowerCase();
    let assigned = false;

    for (const [key, theme] of Object.entries(themes)) {
      if (theme.keywords.some(keyword => text.includes(keyword))) {
        if (!clusters.has(key)) {
          clusters.set(key, []);
        }
        clusters.get(key)!.push(fb);
        assigned = true;
        break;
      }
    }

    if (assigned) return;

    // Fallback 1: general positive praise without a specific theme still deserves
    // its own recognizable cluster rather than disappearing into "Other".
    if (fb.sentiment === 'positive') {
      if (!clusters.has('positive-general')) {
        clusters.set('positive-general', []);
      }
      clusters.get('positive-general')!.push(fb);
      return;
    }

    // Fallback 2: truly uncategorized
    if (!clusters.has('other')) {
      clusters.set('other', []);
    }
    clusters.get('other')!.push(fb);
  });

  // Convert to FeedbackCluster array
  const result: FeedbackCluster[] = [];

  clusters.forEach((feedbackList, key) => {
    if (feedbackList.length === 0) return;

    const sentiment = calculateSentimentDistribution(feedbackList);
    const dates = feedbackList.map(f => f.date);
    const trend = detectTrend(dates);
    const { priority } = calculatePriority(feedbackList);

    const theme = themes[key];
    const title = theme?.title || (key === 'positive-general' ? 'General Praise & Satisfaction' : 'Other Feedback');

    const cluster: FeedbackCluster = {
      id: `cluster-${key}`,
      title,
      feedbackIds: feedbackList.map(f => f.id),
      sentimentDistribution: sentiment,
      impactLevel: priority,
      trend,
      aiSummary: generateClusterSummary(feedbackList, title),
      exampleFeedback: feedbackList.slice(0, 2),
      createdAt: Date.now(),
    };

    result.push(cluster);
  });

  return result;
}

// Calculate sentiment distribution for a cluster
function calculateSentimentDistribution(feedbacks: Feedback[]): SentimentDistribution {
  let positive = 0,
    neutral = 0,
    negative = 0;

  feedbacks.forEach(f => {
    if (f.sentiment === 'positive') positive++;
    else if (f.sentiment === 'negative') negative++;
    else neutral++;
  });

  return { positive, neutral, negative };
}

// Generate AI summary for a cluster
function generateClusterSummary(feedbacks: Feedback[], title: string): string {
  const total = feedbacks.length;
  const recent = feedbacks.filter(f => Date.now() - f.date < 604800000).length;
  const sentiment = calculateSentimentDistribution(feedbacks);

  const negativePercent = Math.round((sentiment.negative / total) * 100);

  if (title.includes('Payment') || title.includes('Checkout')) {
    return `${total} users report issues with ${title.toLowerCase()}. ${negativePercent}% express frustration. This is costing conversions and needs urgent attention.`;
  }

  if (title.includes('Performance') || title.includes('Stability')) {
    return `Performance degradation reported by ${total} users. Crashes and slowdowns occurring, especially on mobile and slow connections. Critical for user retention.`;
  }

  if (title.includes('Dark Mode')) {
    return `${total} users specifically request dark mode. Frequently mentioned in evening/night usage. Could improve engagement and user satisfaction.`;
  }

  if (title.includes('Mobile App')) {
    return `${total} users want native mobile apps. Currently using web wrappers. Mobile app could capture additional users and improve retention.`;
  }

  if (title.includes('Export')) {
    return `${total} users need data export and reporting features. Business users and bulk customers require this for operations. High priority for B2B growth.`;
  }

  if (title.includes('General Praise')) {
    const positivePercent = Math.round((sentiment.positive / total) * 100);
    return `${total} users left unprompted positive feedback with no specific complaint attached. ${positivePercent}% purely positive - a healthy signal of baseline satisfaction, though it carries no direct product action.`;
  }

  return `${total} users reporting feedback related to "${title}". ${recent} reports in the last week. ${negativePercent}% express negative sentiment.`;
}

// Generate actionable insights from feedback
export function generateInsights(feedbacks: Feedback[], clusters: FeedbackCluster[]): ProductInsight[] {
  const insights: ProductInsight[] = [];

  // Group by aiClassification
  const bugFeedback = feedbacks.filter(f => f.aiClassification === 'bug');
  const featureRequests = feedbacks.filter(f => f.aiClassification === 'feature');
  const uxIssues = feedbacks.filter(f => f.aiClassification === 'ux');
  const performanceIssues = feedbacks.filter(f => f.aiClassification === 'performance');

  // Insight 1: Critical Bugs
  if (bugFeedback.length >= 5) {
    const criticalBugs = bugFeedback.filter(f => f.priority === 'critical').length;
    const trend = detectTrend(bugFeedback.map(f => f.date));
    insights.push({
      id: 'insight-bugs-001',
      title: `${bugFeedback.length} Bug Reports Require Attention`,
      evidence: `${criticalBugs} critical issues reported. Users reporting payment failures, crashes, and search problems.`,
      impact: 'High - directly affecting conversions and user retention',
      trend,
      suggestedAction: 'Prioritize critical bug fixes in next sprint. Payment issues especially urgent.',
    });
  }

  // Insight 2: Top Feature Requests
  if (featureRequests.length >= 5) {
    const darkModeRequests = featureRequests.filter(f => f.text.toLowerCase().includes('dark')).length;
    const mobileAppRequests = featureRequests.filter(f =>
      f.text.toLowerCase().includes('app') || f.text.toLowerCase().includes('native'),
    ).length;
    const exportRequests = featureRequests.filter(f => f.text.toLowerCase().includes('export')).length;

    insights.push({
      id: 'insight-features-001',
      title: `Most Requested Features`,
      evidence: `Dark Mode (${darkModeRequests}), Native Mobile Apps (${mobileAppRequests}), Export/Reporting (${exportRequests})`,
      impact: 'Medium-High - could significantly improve user satisfaction',
      trend: 'increasing',
      suggestedAction: 'Consider feature roadmap prioritization based on user demand and potential impact.',
    });
  }

  // Insight 3: UX Problems
  if (uxIssues.length >= 5) {
    const trend = detectTrend(uxIssues.map(f => f.date));
    const recentIssues = uxIssues.filter(f => Date.now() - f.date < 604800000).length;

    insights.push({
      id: 'insight-ux-001',
      title: `UX Issues Impacting User Experience`,
      evidence: `${uxIssues.length} UX-related complaints. ${recentIssues} reported in last week. Checkout complexity, navigation confusion, and account management issues.`,
      impact: 'Medium - affecting user satisfaction and conversion rates',
      trend,
      suggestedAction: 'Conduct UX audit. Focus on checkout flow and navigation simplification.',
    });
  }

  // Insight 4: Performance Concerns
  if (performanceIssues.length >= 3) {
    const trend = detectTrend(performanceIssues.map(f => f.date));
    insights.push({
      id: 'insight-perf-001',
      title: `Performance Degradation Reported`,
      evidence: `${performanceIssues.length} users report slowness, timeouts, and battery drain. Mobile particularly affected.`,
      impact: 'High - critical for mobile user retention',
      trend,
      suggestedAction: 'Profile app performance. Optimize image loading, API calls, and mobile experience.',
    });
  }

  // Insight 5: Sentiment Trend
  const allSentiment = feedbacks.map(f => ({ date: f.date, sentiment: f.sentiment })).sort((a, b) => a.date - b.date);
  if (allSentiment.length >= 10) {
    const midpoint = Math.floor(allSentiment.length / 2);
    const firstHalf = allSentiment.slice(0, midpoint);
    const secondHalf = allSentiment.slice(midpoint);

    const firstHalfNegative = firstHalf.filter(f => f.sentiment === 'negative').length;
    const secondHalfNegative = secondHalf.filter(f => f.sentiment === 'negative').length;

    let trend: TrendDirection = 'stable';
    if (secondHalfNegative > firstHalfNegative * 1.1) {
      trend = 'increasing';
    } else if (secondHalfNegative < firstHalfNegative * 0.9) {
      trend = 'decreasing';
    }

    const negativePercent = Math.round((secondHalfNegative / secondHalf.length) * 100);

    insights.push({
      id: 'insight-sentiment-001',
      title: `Overall Sentiment Trend: ${trend === 'increasing' ? 'Declining' : trend === 'decreasing' ? 'Improving' : 'Stable'}`,
      evidence: `Recent feedback shows ${negativePercent}% negative sentiment. ${secondHalfNegative} negative reports in latest period.`,
      impact: `Medium - indicates overall product health trend`,
      trend,
      suggestedAction:
        trend === 'increasing'
          ? 'Accelerate fixes for high-impact issues to restore user confidence.'
          : trend === 'decreasing'
            ? 'Continue current initiatives; improvements are resonating with users.'
            : 'Monitor closely for any shifts in sentiment.',
    });
  }

  // Insight 6: Highest-impact cluster (uses cluster analysis directly).
  // Praise clusters are excluded - they're not something to "address."
  const rankedClusters = [...clusters]
    .filter(c => c.title !== 'General Praise & Satisfaction' && c.title !== 'Other Feedback')
    .sort((a, b) => b.feedbackIds.length - a.feedbackIds.length);
  const biggestCluster = rankedClusters[0];
  if (biggestCluster && biggestCluster.feedbackIds.length >= 5) {
    const shareOfTotal = Math.round((biggestCluster.feedbackIds.length / feedbacks.length) * 100);
    insights.push({
      id: 'insight-cluster-001',
      title: `"${biggestCluster.title}" is the Largest Feedback Theme`,
      evidence: `${biggestCluster.feedbackIds.length} reports (${shareOfTotal}% of all feedback) belong to this cluster, with a ${biggestCluster.impactLevel} impact rating.`,
      impact: `${biggestCluster.impactLevel === 'critical' || biggestCluster.impactLevel === 'high' ? 'High' : 'Medium'} - single largest driver of user sentiment`,
      trend: biggestCluster.trend,
      suggestedAction: `Address "${biggestCluster.title}" first; it represents the single biggest concentration of user feedback.`,
      clusterId: biggestCluster.id,
    });
  }

  return insights;
}

// Calculate product health score
export function calculateProductHealth(feedbacks: Feedback[]): { score: number; reasons: string[] } {
  const reasons: string[] = [];
  let healthScore = 100;

  // Calculate metrics
  const total = feedbacks.length;
  const negative = feedbacks.filter(f => f.sentiment === 'negative').length;
  const bugs = feedbacks.filter(f => f.aiClassification === 'bug').length;
  const critical = feedbacks.filter(f => f.priority === 'critical').length;
  const recent = feedbacks.filter(f => Date.now() - f.date < 604800000).length;
  const resolved = feedbacks.filter(f => f.status === 'resolved').length;

  // Negative sentiment impact
  const negativePercent = (negative / total) * 100;
  if (negativePercent > 60) {
    healthScore -= 25;
    reasons.push(`High negative sentiment (${Math.round(negativePercent)}%)`);
  } else if (negativePercent > 40) {
    healthScore -= 15;
    reasons.push(`Moderate negative sentiment (${Math.round(negativePercent)}%)`);
  }

  // Bug count impact - scaled to dataset size rather than a fixed raw count,
  // so this formula stays meaningful regardless of how much feedback exists.
  const bugPercent = (bugs / total) * 100;
  if (bugPercent > 20) {
    healthScore -= 20;
    reasons.push(`High bug count (${bugs} reported, ${Math.round(bugPercent)}% of all feedback)`);
  } else if (bugPercent > 10) {
    healthScore -= 10;
    reasons.push(`Moderate bug count (${bugs} reported, ${Math.round(bugPercent)}% of all feedback)`);
  }

  // Critical issues impact - capped so a long tail of critical reports doesn't
  // drive the score to an unrealistic floor.
  if (critical > 0) {
    const criticalPenalty = Math.min(25, 3 * critical);
    healthScore -= criticalPenalty;
    reasons.push(`${critical} critical issue${critical > 1 ? 's' : ''} need immediate attention`);
  }

  // Recent issue trend
  const recentNegative = feedbacks.filter(f => Date.now() - f.date < 604800000 && f.sentiment === 'negative').length;
  if (recentNegative > recent * 0.6) {
    healthScore -= 10;
    reasons.push('Recent issues indicate trend deterioration');
  }

  // Resolution rate
  const resolvedPercent = (resolved / total) * 100;
  if (resolvedPercent > 50) {
    healthScore += 10;
    reasons.push(`Good issue resolution rate (${Math.round(resolvedPercent)}%)`);
  }

  healthScore = Math.max(0, Math.min(100, healthScore));

  if (reasons.length === 0) {
    reasons.push('Product showing strong health metrics');
  }

  return { score: healthScore, reasons };
}

// Main function to process all feedback and generate complete product analysis
export function analyzeProduct(feedbacks: Feedback[]): {
  clusters: FeedbackCluster[];
  insights: ProductInsight[];
  health: { score: number; reasons: string[] };
} {
  const clusters = clusterFeedback(feedbacks);
  const health = calculateProductHealth(feedbacks);
  const insights = generateInsights(feedbacks, clusters);

  return {
    clusters,
    insights,
    health,
  };
}
