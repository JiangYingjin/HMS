'use client'

import { Card, Button } from "@nextui-org/react"
import NurseRegisterForm from "../../components/nurses/NurseRegisterForm"
import { useRouter } from "next/navigation"

export default function NurseRegisterPage() {
  const router = useRouter()

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center gap-4 mb-6">
        <Button
          color="default"
          variant="light"
          onPress={() => router.push('/HMS')}
        >
          返回
        </Button>
        <h1 className="text-2xl font-bold">护士注册</h1>
      </div>
      <Card className="max-w-md mx-auto p-6">
        <NurseRegisterForm />
      </Card>
    </div>
  )
} 