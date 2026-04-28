import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatBytes(mb: number): string {
  if (mb < 1) return `${(mb * 1024).toFixed(0)} KB`
  return `${mb.toFixed(1)} MB`
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })
}

export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    running: 'status-running',
    ready: 'status-running',
    pending: 'status-pending',
    building: 'status-pending',
    deploying: 'status-pending',
    failed: 'status-failed',
    stopped: 'status-failed',
  }
  return map[status] || 'status-pending'
}

export function getFrameworkIcon(framework: string): string {
  const map: Record<string, string> = {
    sklearn: '🔬',
    pytorch: '🔥',
    onnx: '⚡',
    tensorflow: '🧠',
    unknown: '📦',
  }
  return map[framework] || '📦'
}