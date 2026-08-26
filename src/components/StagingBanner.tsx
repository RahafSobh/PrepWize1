/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { AlertTriangle } from 'lucide-react';

interface PublicConfig {
  environment: string;
  isStaging: boolean;
}

export default function StagingBanner() {
  const [config, setConfig] = useState<PublicConfig | null>(null);

  useEffect(() => {
    fetch('/api/config')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setConfig(data))
      .catch(() => setConfig(null));
  }, []);

  if (!config?.isStaging) return null;

  return (
    <div
      id="staging-environment-banner"
      role="status"
      className="w-full bg-amber-500 text-amber-950 text-center text-xs sm:text-sm font-semibold py-2 px-4 flex items-center justify-center gap-2 shadow-sm"
    >
      <AlertTriangle className="w-4 h-4 shrink-0" aria-hidden="true" />
      <span>
        Staging environment ({config.environment}) — for testing only, not production
      </span>
    </div>
  );
}
