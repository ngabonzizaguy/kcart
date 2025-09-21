import React, { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { ArrowLeft, ExternalLink, Hash, Clock, Package, Gift, RefreshCw, Copy, CheckCircle } from 'lucide-react';

interface BlockchainCenterProps {
  language: 'en' | 'rw';
  onBack: () => void;
}

type TransactionType = 'order' | 'reward' | 'refund';
type TransactionStatus = 'confirmed' | 'pending' | 'failed';

interface BlockchainTransaction {
  id: string;
  type: TransactionType;
  date: string;
  timestamp: string;
  status: TransactionStatus;
  transactionHash: string;
  blockNumber: number;
  gasUsed: string;
  orderDetails?: {
    orderId: string;
    amount: number;
    vendor: string;
  };
  rewardDetails?: {
    points: number;
    reason: { en: string; rw: string };
  };
  refundDetails?: {
    amount: number;
    reason: { en: string; rw: string };
  };
}

const mockTransactions: BlockchainTransaction[] = [
  {
    id: '1',
    type: 'order',
    date: '2025-01-24',
    timestamp: '2025-01-24T14:30:00Z',
    status: 'confirmed',
    transactionHash: '0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385',
    blockNumber: 18945672,
    gasUsed: '21,000',
    orderDetails: {
      orderId: 'DG-2025-001',
      amount: 25800,
      vendor: 'Golden Spoon Restaurant'
    }
  },
  {
    id: '2',
    type: 'reward',
    date: '2025-01-24',
    timestamp: '2025-01-24T15:15:00Z',
    status: 'confirmed',
    transactionHash: '0x4e3f47ec1bb89c9db0a7d2c5f8a9b6d3e2c1f0a8b7c6d5e4f3a2b1c0d9e8f7a6',
    blockNumber: 18945680,
    gasUsed: '18,500',
    rewardDetails: {
      points: 258,
      reason: { 
        en: 'Order completion bonus',
        rw: 'Igihembo cyo kurangiza ikurikira'
      }
    }
  },
  {
    id: '3',
    type: 'order',
    date: '2025-01-23',
    timestamp: '2025-01-23T19:45:00Z',
    status: 'confirmed',
    transactionHash: '0xa1b2c3d4e5f67890abcdef1234567890abcdef1234567890abcdef1234567890',
    blockNumber: 18944891,
    gasUsed: '22,150',
    orderDetails: {
      orderId: 'DG-2025-002',
      amount: 18400,
      vendor: 'Spice Garden'
    }
  },
  {
    id: '4',
    type: 'refund',
    date: '2025-01-23',
    timestamp: '2025-01-23T12:20:00Z',
    status: 'confirmed',
    transactionHash: '0xf1e2d3c4b5a69788f1e2d3c4b5a69788f1e2d3c4b5a69788f1e2d3c4b5a69788',
    blockNumber: 18944234,
    gasUsed: '19,800',
    refundDetails: {
      amount: 7200,
      reason: {
        en: 'Order cancelled by customer',
        rw: 'Ikurikira ryaracuguwe na kasitoma'
      }
    }
  },
  {
    id: '5',
    type: 'order',
    date: '2025-01-22',
    timestamp: '2025-01-22T16:10:00Z',
    status: 'pending',
    transactionHash: '0x9876543210abcdef9876543210abcdef9876543210abcdef9876543210abcdef',
    blockNumber: 18943156,
    gasUsed: '20,400',
    orderDetails: {
      orderId: 'DG-2025-003',
      amount: 14200,
      vendor: 'Fresh Kitchen'
    }
  },
  {
    id: '6',
    type: 'reward',
    date: '2025-01-21',
    timestamp: '2025-01-21T11:30:00Z',
    status: 'confirmed',
    transactionHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
    blockNumber: 18942088,
    gasUsed: '17,900',
    rewardDetails: {
      points: 150,
      reason: {
        en: 'First-time customer bonus',
        rw: 'Igihembo cy\'umukiriya wa mbere'
      }
    }
  }
];

export function BlockchainCenter({ language, onBack }: BlockchainCenterProps) {
  const [selectedTransaction, setSelectedTransaction] = useState<BlockchainTransaction | null>(null);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const handleCopyHash = async (hash: string) => {
    try {
      await navigator.clipboard.writeText(hash);
      setCopiedHash(hash);
      setTimeout(() => setCopiedHash(null), 2000);
    } catch (err) {
      console.error('Failed to copy hash:', err);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'en' ? 'en-US' : 'rw-RW', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString(language === 'en' ? 'en-US' : 'rw-RW', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price: number) => {
    return `${price.toLocaleString()} RWF`;
  };

  const truncateHash = (hash: string) => {
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
  };

  const getTransactionIcon = (type: TransactionType) => {
    switch (type) {
      case 'order':
        return Package;
      case 'reward':
        return Gift;
      case 'refund':
        return RefreshCw;
    }
  };

  const getStatusColor = (status: TransactionStatus) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'pending':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'failed':
        return 'bg-red-100 text-red-700 border-red-200';
    }
  };

  const content = {
    en: {
      title: 'Blockchain Center',
      subtitle: 'Transaction History',
      orderType: 'Food Order',
      rewardType: 'Loyalty Reward',
      refundType: 'Refund',
      confirmed: 'Confirmed',
      pending: 'Pending',
      failed: 'Failed',
      transactionDetails: 'Transaction Details',
      transactionDescription: 'View detailed blockchain information for this transaction',
      blockNumber: 'Block Number',
      timestamp: 'Timestamp',
      gasUsed: 'Gas Used',
      transactionHash: 'Transaction Hash',
      viewSmartContract: 'View Smart Contract',
      copyHash: 'Copy Hash',
      hashCopied: 'Hash Copied!',
      orderId: 'Order ID',
      amount: 'Amount',
      vendor: 'Vendor',
      points: 'Points',
      reason: 'Reason',
      noTransactions: 'No transactions found',
      noTransactionsSubtitle: 'Your blockchain transactions will appear here'
    },
    rw: {
      title: 'Ikigo cya Blockchain',
      subtitle: 'Amateka y\'Ibikorwa',
      orderType: 'Ikurikira ry\'Ibiryo',
      rewardType: 'Igihembo cy\'Ubunyangamugayo',
      refundType: 'Gusubiza Amafaranga',
      confirmed: 'Byemejwe',
      pending: 'Bitegereje',
      failed: 'Byarananiwe',
      transactionDetails: 'Amakuru y\'Ikikorwa',
      transactionDescription: 'Reba amakuru arambuye ya blockchain y\'iki gikorwa',
      blockNumber: 'Nomero ya Block',
      timestamp: 'Igihe',
      gasUsed: 'Gaz Yakoreshejwe',
      transactionHash: 'Hash y\'Ikikorwa',
      viewSmartContract: 'Reba Smart Contract',
      copyHash: 'Gukoporora Hash',
      hashCopied: 'Hash Yakoporoye!',
      orderId: 'Nomero y\'Ikurikira',
      amount: 'Amafaranga',
      vendor: 'Ububanza',
      points: 'Amanota',
      reason: 'Impamvu',
      noTransactions: 'Nta bikorwa byabonetse',
      noTransactionsSubtitle: 'Ibikorwa byawe bya blockchain bizagaragara hano'
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-cream-50 to-orange-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-10">
        <div className="flex items-center justify-between p-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{language === 'en' ? 'Back' : 'Subira'}</span>
          </button>
          
          <div className="text-center">
            <h1 className="text-gray-800">{content[language].title}</h1>
            <p className="text-gray-600 text-sm">{content[language].subtitle}</p>
          </div>
          
          <div className="w-16" />
        </div>
      </div>

      <div className="px-6 py-6">
        {/* Transactions List */}
        {mockTransactions.length === 0 ? (
          /* Empty State */
          <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-12 text-center border border-white/20">
            <div className="text-6xl mb-6">⛓️</div>
            <h2 className="text-gray-800 mb-2">{content[language].noTransactions}</h2>
            <p className="text-gray-600">{content[language].noTransactionsSubtitle}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {mockTransactions.map((transaction) => {
              const IconComponent = getTransactionIcon(transaction.type);
              
              return (
                <Card
                  key={transaction.id}
                  className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-3xl p-4 cursor-pointer hover:bg-white/90 transition-all"
                  onClick={() => setSelectedTransaction(transaction)}
                >
                  <div className="flex items-center gap-4">
                    {/* Transaction Icon */}
                    <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                      <IconComponent className="w-6 h-6 text-orange-600" />
                    </div>

                    {/* Transaction Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-gray-800 truncate">
                            {transaction.type === 'order' && content[language].orderType}
                            {transaction.type === 'reward' && content[language].rewardType}
                            {transaction.type === 'refund' && content[language].refundType}
                          </h3>
                          <Badge className={`text-xs ${getStatusColor(transaction.status)}`}>
                            {content[language][transaction.status]}
                          </Badge>
                        </div>
                        <span className="text-gray-500 text-sm">{formatDate(transaction.date)}</span>
                      </div>

                      {/* Transaction Details */}
                      <div className="mb-2">
                        {transaction.orderDetails && (
                          <p className="text-gray-600 text-sm">
                            {transaction.orderDetails.orderId} • {formatPrice(transaction.orderDetails.amount)}
                          </p>
                        )}
                        {transaction.rewardDetails && (
                          <p className="text-gray-600 text-sm">
                            +{transaction.rewardDetails.points} {language === 'en' ? 'points' : 'amanota'}
                          </p>
                        )}
                        {transaction.refundDetails && (
                          <p className="text-gray-600 text-sm">
                            {formatPrice(transaction.refundDetails.amount)}
                          </p>
                        )}
                      </div>

                      {/* Transaction Hash */}
                      <div className="flex items-center gap-2">
                        <Hash className="w-3 h-3 text-gray-400" />
                        <span className="text-gray-500 text-xs font-mono">
                          {truncateHash(transaction.transactionHash)}
                        </span>
                      </div>
                    </div>

                    {/* Arrow Indicator */}
                    <div className="text-gray-400">
                      <ExternalLink className="w-4 h-4" />
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Transaction Detail Modal */}
      <Dialog open={!!selectedTransaction} onOpenChange={() => setSelectedTransaction(null)}>
        <DialogContent className="bg-white/95 backdrop-blur-sm border border-white/20 rounded-3xl max-w-md mx-4">
          <DialogHeader>
            <DialogTitle className="text-center">
              {content[language].transactionDetails}
            </DialogTitle>
            <DialogDescription className="text-center text-gray-600">
              {content[language].transactionDescription}
            </DialogDescription>
          </DialogHeader>

          {selectedTransaction && (
            <div className="space-y-6">
              {/* Transaction Type and Status */}
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-3">
                  {(() => {
                    const IconComponent = getTransactionIcon(selectedTransaction.type);
                    return <IconComponent className="w-8 h-8 text-orange-600" />;
                  })()}
                </div>
                <h3 className="text-gray-800 mb-2">
                  {selectedTransaction.type === 'order' && content[language].orderType}
                  {selectedTransaction.type === 'reward' && content[language].rewardType}
                  {selectedTransaction.type === 'refund' && content[language].refundType}
                </h3>
                <Badge className={getStatusColor(selectedTransaction.status)}>
                  {content[language][selectedTransaction.status]}
                </Badge>
              </div>

              {/* Transaction Details */}
              <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
                {/* Block Number */}
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">{content[language].blockNumber}</span>
                  <span className="text-gray-800 font-mono">#{selectedTransaction.blockNumber.toLocaleString()}</span>
                </div>

                {/* Timestamp */}
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">{content[language].timestamp}</span>
                  <div className="text-right">
                    <div className="text-gray-800">{formatDate(selectedTransaction.date)}</div>
                    <div className="text-gray-600 text-sm">{formatTime(selectedTransaction.timestamp)}</div>
                  </div>
                </div>

                {/* Gas Used */}
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">{content[language].gasUsed}</span>
                  <span className="text-gray-800 font-mono">{selectedTransaction.gasUsed}</span>
                </div>

                {/* Transaction-specific details */}
                {selectedTransaction.orderDetails && (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">{content[language].orderId}</span>
                      <span className="text-gray-800">{selectedTransaction.orderDetails.orderId}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">{content[language].amount}</span>
                      <span className="text-gray-800">{formatPrice(selectedTransaction.orderDetails.amount)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">{content[language].vendor}</span>
                      <span className="text-gray-800">{selectedTransaction.orderDetails.vendor}</span>
                    </div>
                  </>
                )}

                {selectedTransaction.rewardDetails && (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">{content[language].points}</span>
                      <span className="text-green-600 font-medium">+{selectedTransaction.rewardDetails.points}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">{content[language].reason}</span>
                      <span className="text-gray-800 text-right max-w-[200px]">
                        {selectedTransaction.rewardDetails.reason[language]}
                      </span>
                    </div>
                  </>
                )}

                {selectedTransaction.refundDetails && (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">{content[language].amount}</span>
                      <span className="text-red-600 font-medium">{formatPrice(selectedTransaction.refundDetails.amount)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">{content[language].reason}</span>
                      <span className="text-gray-800 text-right max-w-[200px]">
                        {selectedTransaction.refundDetails.reason[language]}
                      </span>
                    </div>
                  </>
                )}
              </div>

              {/* Transaction Hash */}
              <div>
                <label className="text-gray-600 text-sm block mb-2">
                  {content[language].transactionHash}
                </label>
                <div className="bg-gray-50 rounded-2xl p-3 flex items-center gap-2">
                  <span className="font-mono text-sm text-gray-800 flex-1 break-all">
                    {selectedTransaction.transactionHash}
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleCopyHash(selectedTransaction.transactionHash)}
                    className="flex-shrink-0"
                  >
                    {copiedHash === selectedTransaction.transactionHash ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                {copiedHash === selectedTransaction.transactionHash && (
                  <p className="text-green-600 text-sm mt-1 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    {content[language].hashCopied}
                  </p>
                )}
              </div>

              {/* View Smart Contract Button */}
              <Button 
                className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-xl h-12"
                onClick={() => window.open(`https://etherscan.io/tx/${selectedTransaction.transactionHash}`, '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                {content[language].viewSmartContract}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}