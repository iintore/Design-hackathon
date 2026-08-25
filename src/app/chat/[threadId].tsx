import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { Colors } from '@/constants/theme';
import { useAppState } from '@/context/AppStateContext';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ChatScreen() {
  const router = useRouter();
  const { threadId } = useLocalSearchParams<{ threadId: string }>();
  const { chatThreads, sendChatMessage } = useAppState();
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef<ScrollView>(null);

  const thread = chatThreads.find((t) => t.id === threadId);

  useEffect(() => {
    // Scroll to bottom when messages change
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [thread?.messages.length]);

  if (!thread) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Conversation not found.</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.errorLink}>Go back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleSend = () => {
    const trimmed = inputText.trim();
    if (!trimmed) return;
    sendChatMessage(thread.id, trimmed);
    setInputText('');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Chat Header */}
      <View style={styles.chatHeader}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={24} color={Colors.light.text} />
        </TouchableOpacity>

        <View style={[styles.headerAvatar, { backgroundColor: thread.contactColor }]}>
          <Text style={styles.headerAvatarText}>{thread.contactInitial}</Text>
        </View>

        <View style={styles.headerInfo}>
          <Text style={styles.headerName}>{thread.contactName}</Text>
          <Text style={styles.headerRole}>{thread.contactRole}</Text>
        </View>

        <TouchableOpacity style={styles.headerActionBtn} activeOpacity={0.7}>
          <Ionicons name="call-outline" size={20} color={Colors.light.primary} />
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <KeyboardAvoidingView
        style={styles.chatBody}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.messagesScroll}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}
        >
          {/* Date separator */}
          <View style={styles.dateSeparator}>
            <View style={styles.dateLine} />
            <Text style={styles.dateText}>Today</Text>
            <View style={styles.dateLine} />
          </View>

          {thread.messages.map((msg, idx) => {
            // Show time separator if gap > 10 min or different time shown
            const showTime =
              idx === 0 ||
              thread.messages[idx - 1].time !== msg.time;

            return (
              <View key={msg.id}>
                {showTime && !msg.isMe && (
                  <Text style={styles.timeLabel}>{msg.time}</Text>
                )}

                <View
                  style={[
                    styles.bubbleRow,
                    msg.isMe ? styles.bubbleRowRight : styles.bubbleRowLeft,
                  ]}
                >
                  {/* Contact avatar for received messages */}
                  {!msg.isMe && (
                    <View style={[styles.bubbleAvatar, { backgroundColor: thread.contactColor }]}>
                      <Text style={styles.bubbleAvatarText}>{thread.contactInitial}</Text>
                    </View>
                  )}

                  <View
                    style={[
                      styles.bubble,
                      msg.isMe ? styles.bubbleSent : styles.bubbleReceived,
                    ]}
                  >
                    <Text
                      style={[
                        styles.bubbleText,
                        msg.isMe ? styles.bubbleTextSent : styles.bubbleTextReceived,
                      ]}
                    >
                      {msg.text}
                    </Text>
                  </View>

                  {/* My avatar for sent messages */}
                  {msg.isMe && (
                    <View style={[styles.bubbleAvatar, { backgroundColor: '#E0E0E0' }]}>
                      <Ionicons name="person" size={14} color="#8E8E93" />
                    </View>
                  )}
                </View>

                {showTime && msg.isMe && (
                  <Text style={[styles.timeLabel, styles.timeLabelRight]}>{msg.time}</Text>
                )}
              </View>
            );
          })}
        </ScrollView>

        {/* Input Bar */}
        <View style={styles.inputBar}>
          <TouchableOpacity style={styles.attachBtn} activeOpacity={0.7}>
            <Ionicons name="attach" size={22} color="#8E8E93" />
          </TouchableOpacity>

          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              placeholder="Type a message..."
              placeholderTextColor="#A0A0A5"
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
              onSubmitEditing={handleSend}
              returnKeyType="send"
            />
          </View>

          <TouchableOpacity
            style={[styles.sendBtn, inputText.trim() ? styles.sendBtnActive : {}]}
            onPress={handleSend}
            activeOpacity={0.7}
            disabled={!inputText.trim()}
          >
            <Ionicons
              name="send"
              size={18}
              color={inputText.trim() ? '#FFFFFF' : '#C4C4C6'}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.light.textSecondary,
    marginBottom: 12,
  },
  errorLink: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.light.primary,
  },

  // Header
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F2',
    backgroundColor: '#FFFFFF',
  },
  backBtn: {
    padding: 4,
    marginRight: 8,
  },
  headerAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  headerAvatarText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  headerInfo: {
    flex: 1,
  },
  headerName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 17,
    color: Colors.light.text,
  },
  headerRole: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginTop: 1,
  },
  headerActionBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F7',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Chat body
  chatBody: {
    flex: 1,
  },
  messagesScroll: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },

  // Date separator
  dateSeparator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 4,
  },
  dateLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dateText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#8E8E93',
    paddingHorizontal: 16,
  },

  // Time labels
  timeLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 11,
    color: '#8E8E93',
    marginBottom: 4,
    marginTop: 12,
    marginLeft: 48,
  },
  timeLabelRight: {
    textAlign: 'right',
    marginLeft: 0,
    marginRight: 48,
    marginTop: 4,
    marginBottom: 8,
  },

  // Bubbles
  bubbleRow: {
    flexDirection: 'row',
    marginBottom: 6,
    alignItems: 'flex-end',
  },
  bubbleRowLeft: {
    justifyContent: 'flex-start',
  },
  bubbleRowRight: {
    justifyContent: 'flex-end',
  },
  bubbleAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bubbleAvatarText: {
    fontFamily: 'Inter-Bold',
    fontSize: 12,
    color: '#FFFFFF',
  },
  bubble: {
    maxWidth: '72%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginHorizontal: 8,
  },
  bubbleReceived: {
    backgroundColor: '#F0F0F2',
    borderBottomLeftRadius: 4,
  },
  bubbleSent: {
    backgroundColor: Colors.light.primary,
    borderBottomRightRadius: 4,
  },
  bubbleText: {
    fontSize: 15,
    lineHeight: 21,
  },
  bubbleTextReceived: {
    fontFamily: 'Inter-Regular',
    color: Colors.light.text,
  },
  bubbleTextSent: {
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
  },

  // Input bar
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F2',
    backgroundColor: '#FFFFFF',
    paddingBottom: Platform.OS === 'ios' ? 10 : 10,
  },
  attachBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: '#F5F5F7',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 10 : 8,
    maxHeight: 100,
    marginRight: 8,
  },
  textInput: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: Colors.light.text,
    padding: 0,
    lineHeight: 20,
  },
  sendBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendBtnActive: {
    backgroundColor: Colors.light.primary,
  },
});
