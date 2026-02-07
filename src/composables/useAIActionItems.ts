export interface AIActionItemRecommendation {
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  category: string
}

export interface AIActionItemsResponse {
  success: boolean
  data: {
    cardTitles: string[]
    recommendations: AIActionItemRecommendation[]
    generatedAt: string
  }
}

export async function generateAIActionItems(
  cardTitles: string[]
): Promise<AIActionItemRecommendation[]> {
  if (cardTitles.length === 0) {
    throw new Error('No cards available to generate action items from')
  }

  const apiUrl = import.meta.env.VITE_AI_API_URL
  if (!apiUrl) {
    throw new Error('AI API URL not configured. Please set VITE_AI_API_URL in environment variables.')
  }

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ cardTitles }),
  })

  if (!response.ok) {
    throw new Error(`AI API request failed: ${response.statusText}`)
  }

  const data: AIActionItemsResponse = await response.json()

  if (!data.success) {
    throw new Error('AI API returned unsuccessful response')
  }

  return data.data.recommendations
}
