import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Copy, Check, Wallet } from 'lucide-react';
import { toast } from 'sonner';

interface PaymentMethod {
  name: string;
  number: string;
  color: string;
  icon: string;
}

const paymentMethods: PaymentMethod[] = [
  { name: 'GoPay', number: '085974238938', color: 'bg-[#00AA13]', icon: '💚' },
  { name: 'Dana', number: '085974238938', color: 'bg-[#108EE9]', icon: '💙' },
  { name: 'OVO', number: '085974238938', color: 'bg-[#4C3494]', icon: '💜' },
];

interface DonationCardProps {
  compact?: boolean;
}

const DonationCard = ({ compact = false }: DonationCardProps) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    toast.success('Nomor berhasil disalin!');
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  if (compact) {
    return (
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Heart className="h-4 w-4 text-primary fill-primary" />
            <span className="font-medium text-sm">Support Us</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {paymentMethods.map((method, index) => (
              <Button
                key={method.name}
                variant="outline"
                size="sm"
                className="text-xs gap-1"
                onClick={() => copyToClipboard(method.number, index)}
              >
                <span>{method.icon}</span>
                {method.name}
                {copiedIndex === index ? (
                  <Check className="h-3 w-3 text-green-500" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-background to-primary/10 overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="p-2 rounded-full bg-primary/10">
            <Heart className="h-5 w-5 text-primary fill-primary animate-pulse" />
          </div>
          Dukung Kami
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Bantu kami tetap online dengan donasi via e-wallet
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {paymentMethods.map((method, index) => (
          <div
            key={method.name}
            className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
          >
            <div className="flex items-center gap-3">
              <Badge className={`${method.color} text-white border-0`}>
                {method.icon} {method.name}
              </Badge>
              <span className="font-mono text-sm">{method.number}</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => copyToClipboard(method.number, index)}
              className="h-8 w-8"
            >
              {copiedIndex === index ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        ))}
        
        <div className="pt-2 text-center">
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Wallet className="h-3 w-3" />
            <span>Tap untuk salin nomor</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DonationCard;
