import { useState } from "react";
import type { Visibility } from "@/types";

export function useVisibility(initial: Visibility = "PUBLIC") {
    const [visibility, setVisibility] = useState<Visibility>(initial);
    return { visibility, setVisibility };
}
