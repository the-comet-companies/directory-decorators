'use client'

import { useState, useRef, useEffect } from 'react'

interface Message {
  from: 'bot' | 'user'
  text: string
  links?: { label: string; href: string }[]
  suggestions?: string[]
}

const FAQ: { keywords: string[]; answer: string; links?: { label: string; href: string }[]; suggestions?: string[] }[] = [
  {
    keywords: ['printing method', 'what methods', 'what services', 'types of printing', 'what do you cover', 'services'],
    answer: 'We cover 9 printing methods: Screen Printing, DTG, DTF, Embroidery, Heat Transfer, Sublimation, Vinyl Printing, Large Format, and Custom Apparel. Each has its own sweet spot!',
    links: [{ label: 'Browse All Services', href: '/services' }],
    suggestions: ['Which method is cheapest?', 'Best for small orders?'],
  },
  {
    keywords: ['difference', 'dtg vs', 'screen vs', 'screen printing vs', 'compare methods'],
    answer: 'Screen printing is best for bulk orders (24+) with fewer colors — vibrant and durable. DTG is ideal for small runs and full-color photo prints with no minimums. Screen printing gets cheaper per unit at higher quantities, while DTG stays relatively flat.',
    links: [{ label: 'Read Full Comparison', href: '/guides/screen-printing-vs-dtg' }],
    suggestions: ['How much does screen printing cost?', 'Best for small orders?'],
  },
  {
    keywords: ['small order', 'one piece', 'no minimum', 'single', 'few pieces', '1 shirt'],
    answer: 'For small orders (1-12 pieces), DTG and DTF printing are your best bets — most shops have no minimums. Heat transfer also works well for one-offs. Screen printing typically requires 12-24 piece minimums due to setup costs.',
    links: [{ label: 'Try Cost Estimator', href: '/cost-estimator' }],
    suggestions: ['How much does DTG cost?', 'Find printers near me'],
  },
  {
    keywords: ['how much', 'cost', 'price', 'pricing', 'expensive', 'cheap', 'cheapest', 'affordable'],
    answer: 'Pricing varies by method, quantity, and garment. As a rough guide: Screen printing runs $3-15/shirt (cheaper at volume), DTG is $6-25/shirt, and embroidery is $4-30/piece depending on stitch count. Use our Cost Estimator for a quick ballpark!',
    links: [{ label: 'Cost Estimator', href: '/cost-estimator' }, { label: 'Embroidery Pricing Guide', href: '/guides/how-much-does-embroidery-cost' }],
    suggestions: ['What affects pricing?', 'Best for bulk orders?'],
  },
  {
    keywords: ['affects price', 'what affects', 'why price', 'price depend', 'factors'],
    answer: 'Several factors affect pricing: number of ink colors, print size and placement, garment type (hoodies cost more than tees), quantity (bulk = cheaper per unit), turnaround speed (rush costs extra), and design complexity.',
    links: [{ label: 'Cost Estimator', href: '/cost-estimator' }],
  },
  {
    keywords: ['near me', 'find printer', 'local', 'my area', 'close to me', 'nearby'],
    answer: 'Use our Near Me page to find printers in your area! It shows companies on a map so you can browse by location. You can filter by state and city too.',
    links: [{ label: 'Find Near Me', href: '/near-me' }],
    suggestions: ['What states do you cover?', 'How do I contact a printer?'],
  },
  {
    keywords: ['states', 'what states', 'coverage', 'nationwide', 'locations', 'where'],
    answer: 'We cover all 50 states with 15,000+ verified printing companies! Our biggest directories are in California, New York, Texas, Florida, Massachusetts, Oregon, and Ohio.',
    links: [{ label: 'Browse by State', href: '/' }],
  },
  {
    keywords: ['list my business', 'add my company', 'get listed', 'sign up', 'register', 'listing'],
    answer: 'You can list your printing business for free! Just fill out the form and we\'ll review your submission. It takes less than 5 minutes.',
    links: [{ label: 'List Your Business', href: '/list-business' }],
  },
  {
    keywords: ['turnaround', 'how long', 'delivery time', 'when will', 'how fast', 'timeline'],
    answer: 'Typical turnaround is 5-14 business days depending on the method and quantity. Screen printing and embroidery usually take 7-14 days, while DTG and DTF can often be done in 1-3 days. Many shops offer rush services for faster delivery.',
    links: [{ label: 'Browse Printers', href: '/' }],
    suggestions: ['Do printers offer rush orders?', 'Find printers near me'],
  },
  {
    keywords: ['rush', 'urgent', 'fast', 'quick', 'same day', 'next day', 'hurry'],
    answer: 'Yes! Many printers in our directory offer rush services — some even same-day or next-day. You can filter for rush-available shops on the browse page. Expect to pay 20-50% extra for rush orders.',
    links: [{ label: 'Browse Printers', href: '/' }],
  },
  {
    keywords: ['minimum order', 'moq', 'min order', 'minimum quantity', 'how many'],
    answer: 'It depends on the method. Screen printing typically requires 12-24 pieces minimum. DTG, DTF, and heat transfer often have no minimums — you can order as few as 1 piece. Embroidery varies by shop, usually 6-12 pieces.',
    links: [{ label: 'Cost Estimator', href: '/cost-estimator' }],
  },
  {
    keywords: ['bulk', 'large order', 'wholesale', 'big order', '500', '1000', 'high volume'],
    answer: 'For bulk orders (100+ pieces), screen printing gives you the best per-unit price. The more you order, the cheaper each piece gets. Many shops also offer volume discounts on embroidery. Check our Cost Estimator to see how prices drop at higher quantities.',
    links: [{ label: 'Cost Estimator', href: '/cost-estimator' }],
    suggestions: ['How much does screen printing cost?', 'Find printers near me'],
  },
  {
    keywords: ['embroidery', 'stitch', 'embroider'],
    answer: 'Embroidery stitches thread directly into fabric for a raised, premium look. Great for logos on hats, polos, and jackets. Pricing depends on stitch count — simple logos start around $4-8/piece, complex designs can go up to $20-30.',
    links: [{ label: 'Embroidery Pricing Guide', href: '/guides/how-much-does-embroidery-cost' }, { label: 'Browse Embroidery Shops', href: '/service/embroidery' }],
  },
  {
    keywords: ['eco', 'sustainable', 'green', 'environment', 'eco-friendly', 'waterbased'],
    answer: 'Many shops in our directory offer eco-friendly options like waterbased inks, organic cotton, and sustainable practices. You can spot them by the "Eco" badge on their listings.',
    links: [{ label: 'Browse Printers', href: '/' }],
  },
  {
    keywords: ['contact', 'reach', 'talk to', 'phone', 'email', 'get in touch'],
    answer: 'You can contact any printer directly from their profile page. Each listing shows their phone number, email, and website. Just click on a provider to see their full details and reach out!',
    links: [{ label: 'Browse Printers', href: '/' }],
  },
  {
    keywords: ['hello', 'hi', 'hey', 'sup', 'good morning', 'good afternoon'],
    answer: 'Hey there! I\'m Inky, your printing guide. I can help you find the right printing method, estimate costs, or locate printers near you. What can I help with?',
    suggestions: ['What printing methods do you cover?', 'How much does printing cost?', 'Find printers near me'],
  },
  {
    keywords: ['thank', 'thanks', 'thx', 'appreciate'],
    answer: 'You\'re welcome! If you have more questions, I\'m right here. Happy printing!',
    suggestions: ['Find printers near me', 'Cost Estimator'],
  },
]

const WELCOME: Message = {
  from: 'bot',
  text: 'Hey! I\'m Inky, your printing guide. Ask me anything about printing methods, pricing, or finding the right provider.',
  suggestions: ['What printing methods do you cover?', 'How much does printing cost?', 'Find printers near me', 'Best for small orders?'],
}

const FALLBACK: Message = {
  from: 'bot',
  text: 'Hmm, I\'m not sure about that one. Try asking about printing methods, pricing, turnaround times, or finding printers near you. Or check out these pages:',
  links: [
    { label: 'Browse Printers', href: '/' },
    { label: 'All Services', href: '/services' },
    { label: 'Cost Estimator', href: '/cost-estimator' },
    { label: 'Find Near Me', href: '/near-me' },
  ],
  suggestions: ['What printing methods do you cover?', 'How much does printing cost?'],
}

function findAnswer(input: string): Message {
  const lower = input.toLowerCase()
  let bestMatch: (typeof FAQ)[0] | null = null
  let bestScore = 0

  for (const faq of FAQ) {
    let score = 0
    for (const kw of faq.keywords) {
      if (lower.includes(kw)) score += kw.length
    }
    if (score > bestScore) {
      bestScore = score
      bestMatch = faq
    }
  }

  if (bestMatch && bestScore > 0) {
    return {
      from: 'bot',
      text: bestMatch.answer,
      links: bestMatch.links,
      suggestions: bestMatch.suggestions,
    }
  }

  return FALLBACK
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([WELCOME])
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = (text: string) => {
    const userMsg: Message = { from: 'user', text }
    const botMsg = findAnswer(text)
    setMessages(prev => [...prev, userMsg, botMsg])
  }

  return (
    <>
      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-20 right-4 sm:right-6 z-50 w-[340px] sm:w-[380px] max-h-[500px] flex flex-col bg-white rounded-2xl border border-surface-200 shadow-elevated overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-surface-100 bg-black text-white">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold">I</div>
              <div>
                <p className="text-sm font-semibold leading-tight">Inky</p>
                <p className="text-[10px] text-white/60">Printing Guide</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/60 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 min-h-[280px] max-h-[340px]">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                  msg.from === 'user'
                    ? 'bg-black text-white rounded-br-md'
                    : 'bg-surface-100 text-surface-800 rounded-bl-md'
                }`}>
                  <p>{msg.text}</p>

                  {/* Links */}
                  {msg.links && msg.links.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {msg.links.map(link => (
                        <a
                          key={link.href}
                          href={link.href}
                          className="inline-flex items-center gap-1 text-xs font-medium bg-white border border-surface-200 rounded-full px-2.5 py-1 text-surface-700 hover:border-surface-400 transition-colors"
                          onClick={() => setOpen(false)}
                        >
                          {link.label}
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                          </svg>
                        </a>
                      ))}
                    </div>
                  )}

                  {/* Suggestions */}
                  {msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {msg.suggestions.map(s => (
                        <button
                          key={s}
                          onClick={() => send(s)}
                          className="text-xs font-medium bg-white border border-surface-200 rounded-full px-2.5 py-1 text-surface-600 hover:border-surface-400 hover:text-surface-800 transition-colors"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={() => setOpen(prev => !prev)}
        className="fixed bottom-4 right-4 sm:right-6 z-50 w-14 h-14 rounded-full bg-black text-white shadow-lg hover:bg-neutral-800 transition-all duration-200 flex items-center justify-center group"
        aria-label="Chat with Inky"
      >
        {open ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
          </svg>
        )}
      </button>
    </>
  )
}
