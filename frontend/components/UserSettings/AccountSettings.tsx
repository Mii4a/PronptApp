import { useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { UseFormReturn } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

// 型エイリアスを定義
type FormProps = {
  form: UseFormReturn<any>;
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
};

export const AccountSettings = ({ form, isEditing, setIsEditing }: FormProps ) => {
  {return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(console.log)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>名前</FormLabel>
              <FormControl>
                <Input {...field} disabled={!isEditing} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>メールアドレス</FormLabel>
              <FormControl>
                <Input {...field} disabled={!isEditing} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>自己紹介</FormLabel>
              <FormControl>
                <Textarea {...field} disabled={!isEditing} />
              </FormControl>
              <FormDescription>
                160文字以内で自己紹介を書いてください。
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {isEditing ? (
          <Button type="submit">保存</Button>
        ) : (
          <Button type="button" onClick={() => setIsEditing(true)}>
            編集
          </Button>
        )}
      </form>
    </Form>
  )}
}