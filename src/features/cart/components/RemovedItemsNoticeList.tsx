import type { CartItem } from "../types/cart";
import { Card, CardContent } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Trash2, Undo } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

type Props = {
  items: CartItem[];
  onUndo: (id: string) => void;
};

export function RemovedItemsNoticeList({ items, onUndo }: Props) {
  return (
    <AnimatePresence>
      {items.map((item) => (
        <motion.div
          key={`eliminated-${item.id}`}
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="mb-4"
        >
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Trash2 className="h-4 w-4 text-orange-600" />
                  <span className="text-sm">
                    <strong>{item.name}</strong> fue eliminado del carrito
                  </span>
                </div>

                <Button variant="outline" size="sm" onClick={() => onUndo(item.id)}>
                  <Undo className="h-3 w-3 mr-1" />
                  Deshacer
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </AnimatePresence>
  );
}
