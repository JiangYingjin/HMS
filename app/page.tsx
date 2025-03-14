'use client'

import React from 'react'
import { Card, CardBody, Button } from "@nextui-org/react"
import { useRouter } from "next/navigation"
import Image from 'next/image'
import PageTitle from '@/app/components/PageTitle'

export default function HMSHomePage() {
  const router = useRouter()

  return (
    <PageTitle title="首页">
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              医院管理系统
            </h1>
            <p className="text-xl text-gray-600">
              为医护人员和患者提供便捷的医疗服务管理平台
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* 登录卡片 */}
            <Card className="p-4 hover:shadow-lg transition-shadow">
              <CardBody>
                <div className="text-center mb-4">
                  <h2 className="text-2xl font-bold text-gray-800">已有账号？</h2>
                  <p className="text-gray-600 mt-2">
                    登录您的账号以访问系统功能
                  </p>
                </div>
                <Button
                  color="primary"
                  size="lg"
                  onPress={() => router.push('/login')}
                  fullWidth
                >
                  登录
                </Button>
              </CardBody>
            </Card>

            {/* 注册卡片 */}
            <Card className="p-4 hover:shadow-lg transition-shadow">
              <CardBody>
                <div className="text-center mb-4">
                  <h2 className="text-2xl font-bold text-gray-800">首次使用？</h2>
                  <p className="text-gray-600 mt-2">
                    选择您的身份开始注册
                  </p>
                </div>
                <div className="space-y-3">
                  <Button
                    color="secondary"
                    variant="flat"
                    onPress={() => router.push('/register/doctor')}
                    fullWidth
                  >
                    医生注册
                  </Button>
                  <Button
                    color="secondary"
                    variant="flat"
                    onPress={() => router.push('/register/nurse')}
                    fullWidth
                  >
                    护士注册
                  </Button>
                  <Button
                    color="secondary"
                    variant="flat"
                    onPress={() => router.push('/register/patient')}
                    fullWidth
                  >
                    患者注册
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* 系统特点 */}
          <div className="mt-16 grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <i className="text-2xl text-blue-600">🏥</i>
              </div>
              <h3 className="text-xl font-semibold mb-2">便捷管理</h3>
              <p className="text-gray-600">高效的医疗服务管理系统</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <i className="text-2xl text-blue-600">👨‍⚕️</i>
              </div>
              <h3 className="text-xl font-semibold mb-2">专业服务</h3>
              <p className="text-gray-600">专业的医护团队在线服务</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <i className="text-2xl text-blue-600">📱</i>
              </div>
              <h3 className="text-xl font-semibold mb-2">实时互动</h3>
              <p className="text-gray-600">便捷的在线预约和查询</p>
            </div>
          </div>

          {/* 添加页脚 */}
          <footer className="mt-16 py-8 border-t text-center text-gray-600">
            <p>华南理工大学 · 计算机科学与工程学院</p>
            <p>江英进 · 数据库课程作业</p>
          </footer>
        </div>
      </div>
    </PageTitle>
  )
}
