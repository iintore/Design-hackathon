import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Platform,
  Image,
} from 'react-native';
import { Colors } from '@/constants/theme';
import { useAppState } from '@/context/AppStateContext';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function MessagesScreen() {
  const router = useRouter();
  const { children, chatThreads } = useAppState();
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);

  const filteredThreads = selectedChildId
    ? chatThreads.filter((t) => t.childId === selectedChildId)
    : chatThreads;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.titleText}>Messages</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.headerIconBtn}
            onPress={() => router.push('/contacts')}
            activeOpacity={0.8}
          >
            <Ionicons name="people-outline" size={22} color={Colors.light.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerIconBtn}
            onPress={() => router.push('/flows/send-message')}
            activeOpacity={0.8}
          >
            <Ionicons name="create-outline" size={22} color={Colors.light.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Child Filter Tabs */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          <TouchableOpacity
            onPress={() => setSelectedChildId(null)}
            style={[styles.filterTab, !selectedChildId && styles.filterTabActive]}
            activeOpacity={0.7}
          >
            <Text style={[styles.filterTabText, !selectedChildId && styles.filterTabTextActive]}>
              All
            </Text>
          </TouchableOpacity>
          {children.map((child) => (
            <TouchableOpacity
              key={child.id}
              onPress={() => setSelectedChildId(child.id)}
              style={[
                styles.filterTab,
                selectedChildId === child.id && styles.filterTabActive,
              ]}
              activeOpacity={0.7}
            >
              <Image source={child.avatar} style={styles.avatarImage} />
              <Text
                style={[
                  styles.filterTabText,
                  selectedChildId === child.id && styles.filterTabTextActive,
                ]}
              >
                {child.name.split(' ')[0]}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Thread List */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {filteredThreads.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="chatbubbles-outline" size={48} color="#C4C4C6" />
            <Text style={styles.emptyText}>No conversations yet.</Text>
            <Text style={styles.emptySubText}>Tap the compose icon to start a new message.</Text>
          </View>
        ) : (
          <View style={styles.listContainer}>
            {filteredThreads.map((thread) => {
              const lastMessage = thread.messages[thread.messages.length - 1];
              const previewText = lastMessage
                ? (lastMessage.isMe ? 'You: ' : '') + lastMessage.text
                : 'No messages yet';

              return (
                <TouchableOpacity
                  key={thread.id}
                  onPress={() => router.push(`/chat/${thread.id}`)}
                  activeOpacity={0.7}
                  style={styles.threadRow}
                >
                  {/* Avatar */}
                  <View style={[styles.threadAvatar, { backgroundColor: thread.contactColor }]}>
                    <Text style={styles.threadAvatarText}>{thread.contactInitial}</Text>
                  </View>

                  {/* Content */}
                  <View style={styles.threadContent}>
                    <View style={styles.threadTopRow}>
                      <Text style={styles.threadName} numberOfLines={1}>{thread.contactName}</Text>
                      <Text style={styles.threadTime}>{thread.lastMessageTime}</Text>
                    </View>
                    <View style={styles.threadBottomRow}>
                      <Text style={styles.threadRole}>{thread.contactRole} • {thread.childName.split(' ')[0]}</Text>
                    </View>
                    <View style={styles.threadPreviewRow}>
                      <Text style={[
                        styles.threadPreview,
                        thread.unreadCount > 0 && styles.threadPreviewUnread
                      ]} numberOfLines={1}>
                        {previewText}
                      </Text>
                      {thread.unreadCount > 0 && (
                        <View style={styles.unreadBadge}>
                          <Text style={styles.unreadBadgeText}>{thread.unreadCount}</Text>
                        </View>
                      )}
                    </View>
                  </View>

                  {/* Chevron */}
                  <Ionicons name="chevron-forward" size={16} color="#C4C4C6" style={styles.threadChevron} />
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingBottom: 40,
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 20 : 16,
    paddingBottom: 12,
  },
  headerLeft: {
    flex: 1,
  },
  titleText: {
    fontFamily: 'PPEditorialNew-Regular',
    fontSize: 26,
    color: Colors.light.text,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  filterContainer: {
    marginBottom: 8,
  },
  filterScroll: {
    paddingHorizontal: 24,
    paddingBottom: 8,
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#F5F5F7',
    marginRight: 10,
  },
  filterTabActive: {
    backgroundColor: Colors.light.primaryLight,
    borderWidth: 1,
    borderColor: Colors.light.primary,
  },
  avatarImage: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 6,
  },
  filterTabText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  filterTabTextActive: {
    color: Colors.light.primary,
    fontFamily: 'Inter-SemiBold',
  },
  listContainer: {
    paddingHorizontal: 24,
  },
  threadRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F2',
  },
  threadAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  threadAvatarText: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#FFFFFF',
  },
  threadContent: {
    flex: 1,
  },
  threadTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  threadName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.light.text,
    flex: 1,
    marginRight: 8,
  },
  threadTime: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#8E8E93',
  },
  threadBottomRow: {
    marginBottom: 4,
  },
  threadRole: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  threadPreviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  threadPreview: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#8E8E93',
    flex: 1,
    marginRight: 8,
  },
  threadPreviewUnread: {
    fontFamily: 'Inter-SemiBold',
    color: Colors.light.text,
  },
  unreadBadge: {
    backgroundColor: Colors.light.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadBadgeText: {
    fontFamily: 'Inter-Bold',
    fontSize: 11,
    color: '#FFFFFF',
  },
  threadChevron: {
    marginLeft: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.light.text,
    marginTop: 16,
  },
  emptySubText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginTop: 4,
  },
});
