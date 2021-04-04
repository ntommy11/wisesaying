import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import React from 'react';
import { useRef,useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { View,Text, KeyboardAvoidingView, Platform } from 'react-native';
import styled from "styled-components/native";
import AuthButton from '../components/auth/AuthButton';
import AuthLayout from '../components/auth/AuthLayout';
import {TextInput} from '../components/auth/AuthShared'

const CREATE_ACCOUNT_MUTATION = gql`
  mutation createAccount(
    $firstName: String!,
    $lastName: String,
    $username: String!,
    $email: String!,
    $password: String!
  ){
    createAccount(
      firstName: $firstName
      lastName: $lastName
      username: $username
      email: $email
      password: $password
    ){
      ok
      error
    }
  }
`;

export default function CreateAccount({navigation}){
  const {register, handleSubmit, setValue, getValues} = useForm();

  const onCompleted = (data)=>{
    console.log(data);
    const {createAccount:{ok}} = data; // UNZIP data
    const {username, password} = getValues();
    if(ok){
      navigation.navigate("Login",{
        username:username,
        password:password,
      });
    }
  }

  const [createAccountMutation, {loading}] = useMutation(CREATE_ACCOUNT_MUTATION,{
    onCompleted,
  });
  
  const lastNmaeRef = useRef();
  const usernameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();

  const refs = new Array(5)
  refs.fill(new useRef())

  const onNext = (next)=>{
    next?.current?.focus(); 
  }
  const onValid = (data)=>{
    console.log(data);
    if(!loading){
      createAccountMutation({
        variables:{
          ...data,
        }
      })
    }
  }

  useEffect(()=>{
    register("firstName",{
      required: true,
    });
    register("lastName",{
      required: true,
    });
    register("username",{
      required: true,
    });
    register("email",{
      required: true,
    });
    register("password",{
      required: true,
    });
  },[register])
  return(
    <AuthLayout>
        <TextInput 
          autoFocus
          placeholder="성"
          placeholderTextColor="gray"
          returnKeyType="next"
          onSubmitEditing={()=>onNext(lastNmaeRef)}
          onChangeText={(text)=>setValue("firstName",text)}
        />
        <TextInput 
          ref={lastNmaeRef}
          placeholder="이름"
          placeholderTextColor="gray"
          returnKeyType="next"
          onSubmitEditing={()=>onNext(usernameRef)}
          onChangeText={(text)=>setValue("lastName",text)}
        />
        <TextInput 
          ref = {usernameRef}
          placeholder="아이디"
          placeholderTextColor="gray"
          returnKeyType="next"
          onSubmitEditing={()=>onNext(emailRef)}
          onChangeText={(text)=>setValue("username",text)}
        />
        <TextInput
          ref = {emailRef} 
          placeholder="이메일"
          placeholderTextColor="gray"
          returnKeyType="next"
          onSubmitEditing={()=>onNext(passwordRef)}
          onChangeText={(text)=>setValue("email",text)}
        />
        <TextInput 
          ref={passwordRef}
          placeholder="비밀번호"
          placeholderTextColor="gray"
          returnKeyType="next"
          onSubmitEditing={handleSubmit(onValid)}
          lastOne={true}
          onChangeText={(text)=>setValue("password",text)}
        />
        <AuthButton text="Create Account" disabled={false} onPress={handleSubmit(onValid)} />
    </AuthLayout>
  )
}