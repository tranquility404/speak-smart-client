import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import {
    BarChart3,
    Zap,
    TrendingUp,
    Volume2,
    Clock,
    Target,
    AlertCircle,
    CheckCircle,
    XCircle,
    ChevronDown,
    ChevronUp
} from 'lucide-react';

interface FAQItem {
    id: string;
    question: string;
    icon: React.ReactNode;
    iconBg: string;
    content: React.ReactNode;
}

const FAQPage: React.FC = () => {
    const [openItems, setOpenItems] = useState<Set<string>>(new Set());

    const toggleItem = (id: string) => {
        const newOpenItems = new Set(openItems);
        if (newOpenItems.has(id)) {
            newOpenItems.delete(id);
        } else {
            newOpenItems.add(id);
        }
        setOpenItems(newOpenItems);
    };

    const faqItems: FAQItem[] = [
        {
            id: 'speech-rate',
            question: 'How is my Speech Rate score calculated?',
            icon: <Clock className="h-5 w-5 text-blue-600" />,
            iconBg: 'bg-blue-100',
            content: (
                <div className="space-y-4">
                    <div className="bg-blue-50 rounded-lg p-4">
                        <p className="text-blue-700 text-sm">
                            The closer your speech rate is to <strong>200-250 words per minute</strong>, the higher your score will be.
                            If you speak too slowly (under 200 WPM) or too quickly (over 250 WPM), your score begins to decrease.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-3 bg-red-50 rounded-lg border border-red-200">
                            <XCircle className="h-6 w-6 text-red-500 mx-auto mb-2" />
                            <div className="text-red-700 font-medium text-sm">Too Slow</div>
                            <div className="text-red-600 text-xs">Under 200 WPM</div>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                            <CheckCircle className="h-6 w-6 text-green-500 mx-auto mb-2" />
                            <div className="text-green-700 font-medium text-sm">Optimal Range</div>
                            <div className="text-green-600 text-xs">200-250 WPM</div>
                        </div>
                        <div className="text-center p-3 bg-red-50 rounded-lg border border-red-200">
                            <XCircle className="h-6 w-6 text-red-500 mx-auto mb-2" />
                            <div className="text-red-700 font-medium text-sm">Too Fast</div>
                            <div className="text-red-600 text-xs">Over 250 WPM</div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 'intonation',
            question: 'What does my Intonation score mean?',
            icon: <TrendingUp className="h-5 w-5 text-purple-600" />,
            iconBg: 'bg-purple-100',
            content: (
                <div className="space-y-4">
                    <div className="bg-purple-50 rounded-lg p-4">
                        <p className="text-purple-700 text-sm">
                            Look at the pitch graph in your analysis. The more your voice moves around the average line,
                            the <strong>higher</strong> your score will be. Maintaining the same pitch throughout without any ups
                            or downs makes speech boring - the more it varies naturally, the better your score.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                            <div className="flex items-center mb-2">
                                <XCircle className="h-4 w-4 text-red-500 mr-2" />
                                <span className="font-medium text-red-700 text-sm">Monotone Speech</span>
                            </div>
                            <p className="text-red-600 text-xs">
                                Flat line on the graph - sounds robotic and boring
                            </p>
                        </div>
                        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                            <div className="flex items-center mb-2">
                                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                <span className="font-medium text-green-700 text-sm">Dynamic Speech</span>
                            </div>
                            <p className="text-green-600 text-xs">
                                Natural ups and downs - engaging and expressive
                            </p>
                        </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-gray-700 text-xs">
                            <strong>💡 Tip:</strong> Think of your voice as painting - you want brush strokes that go up and down,
                            not just a straight line across the canvas.
                        </p>
                    </div>
                </div>
            )
        },
        {
            id: 'energy',
            question: 'How is my Energy level measured?',
            icon: <Zap className="h-5 w-5 text-orange-600" />,
            iconBg: 'bg-orange-100',
            content: (
                <div className="space-y-4">
                    <div className="bg-orange-50 rounded-lg p-4">
                        <p className="text-orange-700 text-sm">
                            Energy depends on the combination of <strong>speech rate and loudness</strong>.
                            Speaking more words with more vocal intensity and enthusiasm suggests higher energy levels.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                            <Volume2 className="h-5 w-5 text-yellow-600" />
                            <div>
                                <div className="font-medium text-yellow-800 text-sm">Vocal Intensity</div>
                                <div className="text-yellow-700 text-xs">Higher volume and clearer articulation</div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                            <BarChart3 className="h-5 w-5 text-blue-600" />
                            <div>
                                <div className="font-medium text-blue-800 text-sm">Speech Pace</div>
                                <div className="text-blue-700 text-xs">Consistent delivery without dragging</div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                            <Target className="h-5 w-5 text-green-600" />
                            <div>
                                <div className="font-medium text-green-800 text-sm">Overall Zest</div>
                                <div className="text-green-700 text-xs">Combination creates engaging delivery</div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 'confidence',
            question: 'What affects my Confidence score?',
            icon: <Target className="h-5 w-5 text-green-600" />,
            iconBg: 'bg-green-100',
            content: (
                <div className="space-y-4">
                    <div className="bg-green-50 rounded-lg p-4">
                        <p className="text-green-700 text-sm">
                            The system detects timestamps where you sounded nervous, fumbled words, or took awkward pauses.
                            <strong>Fewer interruptions and hesitations = higher confidence score.</strong>
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                            <h5 className="font-medium text-red-800 text-sm mb-2 flex items-center">
                                <AlertCircle className="h-4 w-4 mr-2" />
                                Confidence Reducers
                            </h5>
                            <ul className="text-red-700 text-xs space-y-1">
                                <li>• Frequent "um" and "uh" sounds</li>
                                <li>• Long awkward pauses</li>
                                <li>• Stumbling over words</li>
                                <li>• Nervous voice trembling</li>
                                <li>• Repetitive false starts</li>
                            </ul>
                        </div>
                        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                            <h5 className="font-medium text-green-800 text-sm mb-2 flex items-center">
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Confidence Boosters
                            </h5>
                            <ul className="text-green-700 text-xs space-y-1">
                                <li>• Smooth, uninterrupted flow</li>
                                <li>• Natural pauses for emphasis</li>
                                <li>• Clear word articulation</li>
                                <li>• Steady voice tone</li>
                                <li>• Minimal hesitations</li>
                            </ul>
                        </div>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-3">
                        <p className="text-blue-700 text-xs">
                            <strong>💡 Pro Tip:</strong> Practice your speech beforehand to reduce fumbles, and remember that
                            strategic pauses for emphasis are different from nervous hesitations!
                        </p>
                    </div>
                </div>
            )
        },
        {
            id: 'overall-score',
            question: 'How is my Overall Score calculated?',
            icon: <BarChart3 className="h-5 w-5 text-indigo-600" />,
            iconBg: 'bg-indigo-100',
            content: (
                <div className="space-y-4">
                    <div className="bg-indigo-50 rounded-lg p-4">
                        <p className="text-indigo-700 text-sm">
                            Your overall score is a weighted combination of all four metrics. Each aspect contributes
                            to your final score, giving you a comprehensive view of your speaking performance.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <Badge className="bg-blue-100 text-blue-700 mb-1">Speech Rate</Badge>
                            <div className="text-xs text-gray-600">25%</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <Badge className="bg-purple-100 text-purple-700 mb-1">Intonation</Badge>
                            <div className="text-xs text-gray-600">25%</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <Badge className="bg-orange-100 text-orange-700 mb-1">Energy</Badge>
                            <div className="text-xs text-gray-600">25%</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <Badge className="bg-green-100 text-green-700 mb-1">Confidence</Badge>
                            <div className="text-xs text-gray-600">25%</div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 'improvement-tips',
            question: 'What are some quick tips to improve my scores?',
            icon: <Target className="h-5 w-5 text-blue-600" />,
            iconBg: 'bg-blue-100',
            content: (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                        <h5 className="font-semibold text-gray-800 text-sm">Before Recording:</h5>
                        <ul className="text-gray-700 text-xs space-y-1">
                            <li>• Practice your speech several times</li>
                            <li>• Record yourself and listen back</li>
                            <li>• Mark places for natural pauses</li>
                            <li>• Warm up your voice</li>
                        </ul>
                    </div>
                    <div className="space-y-3">
                        <h5 className="font-semibold text-gray-800 text-sm">While Speaking:</h5>
                        <ul className="text-gray-700 text-xs space-y-1">
                            <li>• Speak clearly and project your voice</li>
                            <li>• Vary your pitch naturally</li>
                            <li>• Maintain steady pace</li>
                            <li>• Take purposeful pauses</li>
                        </ul>
                    </div>
                </div>
            )
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                {/* Header Section */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-3">
                        Speech Analysis FAQ
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Understanding how your speech scores are calculated
                    </p>
                </div>

                {faqItems.map((item) => (
                    <Card key={item.id} className="rounded-xl border-0 bg-white/90 backdrop-blur-sm overflow-hidden mb-4">
                        <div
                            className="flex items-center justify-between p-6 cursor-pointer select-none hover:bg-gray-50/50 transition-colors"
                            onClick={() => toggleItem(item.id)}
                        >
                            <div className="flex items-center space-x-4">
                                <div className={`w-10 h-10 rounded-lg ${item.iconBg} flex items-center justify-center`}>
                                    {item.icon}
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800">{item.question}</h3>
                            </div>
                            <div className="flex-shrink-0">
                                {openItems.has(item.id) ? (
                                    <ChevronUp className="h-5 w-5 text-gray-600" />
                                ) : (
                                    <ChevronDown className="h-5 w-5 text-gray-600" />
                                )}
                            </div>
                        </div>

                        {openItems.has(item.id) && (
                            <CardContent className="px-6 pb-6 pt-0">
                                <div className="pl-14">
                                    {item.content}
                                </div>
                            </CardContent>
                        )}
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default FAQPage;