import { useEffect, useMemo, useState } from "react";
import type { SavedAddress } from "../../types/checkout";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Checkbox } from "@/shared/ui/checkbox";

type Mode = "create" | "edit";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  mode: Mode;
  initial?: SavedAddress;

  onSave: (address: SavedAddress) => void;
};

function genId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return String(Date.now());
}

export function AddressDialog({ open, onOpenChange, mode, initial, onSave }: Props) {
  const title = mode === "create" ? "Agregar dirección" : "Editar dirección";

  const defaults = useMemo<SavedAddress>(() => {
    return (
      initial ?? {
        id: genId(),
        tipo: "Casa",
        nombre: "",
        direccion: "",
        ciudad: "",
        provincia: "",
        codigoPostal: "",
        telefono: "",
        principal: false,
      }
    );
  }, [initial]);

  const [form, setForm] = useState<SavedAddress>(defaults);

  useEffect(() => {
    setForm(defaults);
  }, [defaults]);

  const setField = <K extends keyof SavedAddress>(key: K, value: SavedAddress[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const canSave =
    form.tipo.trim() &&
    form.nombre.trim() &&
    form.direccion.trim() &&
    form.ciudad.trim() &&
    form.provincia.trim() &&
    form.telefono.trim();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-sm">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="tipo">Tipo</Label>
            <Input id="tipo" value={form.tipo} onChange={(e) => setField("tipo", e.target.value)} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="nombre">Nombre</Label>
            <Input id="nombre" value={form.nombre} onChange={(e) => setField("nombre", e.target.value)} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="direccion">Dirección</Label>
            <Input id="direccion" value={form.direccion} onChange={(e) => setField("direccion", e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="ciudad">Ciudad</Label>
              <Input id="ciudad" value={form.ciudad} onChange={(e) => setField("ciudad", e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="provincia">Provincia</Label>
              <Input id="provincia" value={form.provincia} onChange={(e) => setField("provincia", e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="codigoPostal">Código Postal</Label>
              <Input
                id="codigoPostal"
                value={form.codigoPostal}
                onChange={(e) => setField("codigoPostal", e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="telefono">Teléfono</Label>
              <Input id="telefono" value={form.telefono} onChange={(e) => setField("telefono", e.target.value)} />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="principal"
              checked={form.principal}
              onCheckedChange={(v: boolean | "indeterminate") => setField("principal", Boolean(v))}
            />
            <Label htmlFor="principal">Marcar como principal</Label>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            type="button"
            disabled={!canSave}
            onClick={() => {
              onSave(form);
              onOpenChange(false);
            }}
          >
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
