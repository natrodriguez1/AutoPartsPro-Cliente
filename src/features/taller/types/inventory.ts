import type { ProductCore } from "@/domain/product";

export type InventoryStatus = "bajo_stock" | "normal" | "critico" | "agotado";

export type InventoryItem  = ProductCore & {
    code: string;
    currentStock: number;      
    minStock: number;          
    maxStock: number;          
    purchasePrice: number;          
    location: string;          
    supplier: string;          
    lastInboundDate: string;   
    lastOutboundDate: string;  
    status: InventoryStatus;   
};

export type InventoryMovementType = "entrada" | "salida";

export type InventoryMovement = {
    id: string;
    date: string;
    type: InventoryMovementType;
    product: string;              
    quantity: number;             
    reason: string;               
    user: string;                 
    reference: string;  
};