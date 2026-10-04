import { useState, useEffect } from 'react';
import { useStore } from '@/hooks/useStore';
import { formatPrice } from '@/data/platforms';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { 
  Trash2, 
  ShoppingBag, 
  CreditCard,
  Lock,
  CheckCircle2,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';

interface CheckoutModalProps {
  open: boolean;
  onClose: () => void;
}

export function CheckoutModal({ open, onClose }: CheckoutModalProps) {
  const { cart, removeFromCart, clearCart, currency, addOrder, setCheckoutEmail, user } = useStore();
  const [email, setEmail] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [trackingToken, setTrackingToken] = useState('');

  useEffect(() => {
    if (open && user && !email) {
      setEmail(user.email);
    }
  }, [open, user]);

  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);

  const handleCheckout = async () => {
    if (!email) {
      toast.error('Voer je email adres in');
      return;
    }
    if (!acceptTerms) {
      toast.error('Accepteer de algemene voorwaarden');
      return;
    }

    setIsProcessing(true);
    setCheckoutEmail(email);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate order
    const token = Math.random().toString(36).substring(2, 15);
    const orderNumber = `BP-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(Math.floor(Math.random() * 100000)).padStart(5, '0')}`;
    
    const newOrder = {
      id: Math.random().toString(36).substring(2, 9),
      orderNumber,
      email,
      locale: 'nl' as const,
      currency,
      items: [...cart],
      totalPrice,
      status: 'pending' as const,
      deliveryProgress: 0,
      trackingToken: token,
      createdAt: new Date(),
    };

    addOrder(newOrder);
    setTrackingToken(token);
    setIsProcessing(false);
    setOrderComplete(true);
    clearCart();
  };

  const handleClose = () => {
    if (orderComplete) {
      setOrderComplete(false);
      setEmail('');
      setAcceptTerms(false);
      setTrackingToken('');
    }
    onClose();
  };

  const copyTrackingLink = () => {
    const link = `${window.location.origin}/#/track/${trackingToken}`;
    navigator.clipboard.writeText(link);
    toast.success('Tracking link gekopieerd!');
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-[hsl(220,30%,8%)] border-white/10 p-0">
        {!orderComplete ? (
          <>
            <DialogHeader className="p-6 pb-0">
              <DialogTitle className="text-2xl font-bold text-white flex items-center gap-3">
                <ShoppingBag className="w-6 h-6 text-[hsl(142,76%,45%)]" />
                Afrekenen
              </DialogTitle>
            </DialogHeader>

            <div className="p-6 space-y-6">
              {/* Cart Items */}
              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-white/20" />
                  <p className="text-white/50">Je winkelwagen is leeg</p>
                  <Button
                    onClick={onClose}
                    className="mt-4 bg-[hsl(142,76%,45%)] hover:bg-[hsl(142,76%,40%)] text-[hsl(220,35%,6%)]"
                  >
                    Ga verder met shoppen
                  </Button>
                </div>
              ) : (
                <>
                  <div className="space-y-3">
                    {cart.map((item) => (
                      <Card 
                        key={item.id}
                        className="p-4 bg-white/5 border-white/10 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-[hsl(142,76%,45%)]/20 flex items-center justify-center">
                            <span className="text-[hsl(142,76%,45%)] font-bold">
                              {item.category === 'streams' ? '♪' : '★'}
                            </span>
                          </div>
                          <div>
                            <p className="text-white font-medium">{item.platformName}</p>
                            <p className="text-sm text-white/50">
                              {item.typeName || `${item.quantity} review(s)`}
                              {item.quality === 'premium' && (
                                <Badge variant="outline" className="ml-2 border-[hsl(142,76%,45%)] text-[hsl(142,76%,45%)] text-xs">
                                  Premium
                                </Badge>
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-white font-semibold">
                            {formatPrice(item.price, currency)}
                          </span>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="p-2 rounded-lg hover:bg-white/10 text-white/50 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </Card>
                    ))}
                  </div>

                  {/* Total */}
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="flex items-center justify-between">
                      <span className="text-white/70">Subtotaal</span>
                      <span className="text-white">{formatPrice(totalPrice, currency)}</span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-white/70">BTW (21%)</span>
                      <span className="text-white">{formatPrice(totalPrice * 0.21, currency)}</span>
                    </div>
                    <div className="border-t border-white/10 mt-3 pt-3">
                      <div className="flex items-center justify-between">
                        <span className="text-white font-semibold">Totaal</span>
                        <span className="text-2xl font-bold text-[hsl(142,76%,45%)]">
                          {formatPrice(totalPrice * 1.21, currency)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <Label className="text-white mb-2 block">Email adres</Label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="jouw@email.nl"
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                    />
                    <p className="text-sm text-white/50 mt-2">
                      Je ontvangt de tracking link op dit adres.
                    </p>
                  </div>

                  {/* Terms */}
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="terms"
                      checked={acceptTerms}
                      onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                      className="mt-1 border-white/30 data-[state=checked]:bg-[hsl(142,76%,45%)] data-[state=checked]:border-[hsl(142,76%,45%)]"
                    />
                    <Label htmlFor="terms" className="text-sm text-white/70 cursor-pointer">
                      Ik ga akkoord met de{' '}
                      <a href="#" className="text-[hsl(142,76%,45%)] hover:underline">algemene voorwaarden</a>
                      {' '}en{' '}
                      <a href="#" className="text-[hsl(142,76%,45%)] hover:underline">privacy policy</a>.
                    </Label>
                  </div>

                  {/* Checkout Button */}
                  <Button
                    onClick={handleCheckout}
                    disabled={isProcessing}
                    className="w-full bg-[hsl(142,76%,45%)] hover:bg-[hsl(142,76%,40%)] text-[hsl(220,35%,6%)] font-semibold py-6 text-lg"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Verwerken...
                      </>
                    ) : (
                      <>
                        <Lock className="w-5 h-5 mr-2" />
                        Veilig afrekenen
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>

                  <div className="flex items-center justify-center gap-4 text-white/40">
                    <div className="flex items-center gap-1">
                      <Lock className="w-4 h-4" />
                      <span className="text-xs">SSL Beveiligd</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CreditCard className="w-4 h-4" />
                      <span className="text-xs">Stripe</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </>
        ) : (
          <div className="p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[hsl(142,76%,45%)]/20 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-[hsl(142,76%,45%)]" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Bestelling geplaatst!</h3>
            <p className="text-white/60 mb-6">
              Bedankt voor je bestelling. Je ontvangt een bevestigingsmail op {email}.
            </p>

            <Card className="p-6 bg-white/5 border-white/10 mb-6">
              <p className="text-sm text-white/50 mb-2">Je tracking nummer</p>
              <p className="text-xl font-mono font-bold text-[hsl(142,76%,45%)] mb-4">{trackingToken.toUpperCase()}</p>
              <Button
                variant="outline"
                onClick={copyTrackingLink}
                className="border-white/20 text-white hover:bg-white/10"
              >
                Kopieer tracking link
              </Button>
            </Card>

            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={handleClose}
                className="flex-1 border-white/20 text-white hover:bg-white/10"
              >
                Sluiten
              </Button>
              <Button
                onClick={() => {
                  handleClose();
                  window.location.hash = `#/track/${trackingToken}`;
                }}
                className="flex-1 bg-[hsl(142,76%,45%)] hover:bg-[hsl(142,76%,40%)] text-[hsl(220,35%,6%)]"
              >
                Track bestelling
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
