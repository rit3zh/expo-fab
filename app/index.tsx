import FloatingActionButton from "@/components/Fab";
import { indexStyles as styles } from "@/style/styles";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  Modal,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
const { width } = Dimensions.get("window");

interface Transaction {
  id: string;
  title: string;
  category: string;
  amount: number;
  date: string;
  icon: keyof typeof Ionicons.glyphMap;
  type: "income" | "expense";
  time: string;
}

interface Goal {
  id: string;
  title: string;
  target: number;
  current: number;
  icon: keyof typeof Ionicons.glyphMap;
}

interface Budget {
  category: string;
  limit: number;
  spent: number;
  icon: keyof typeof Ionicons.glyphMap;
}

const initialTransactions: Transaction[] = [
  {
    id: "1",
    title: "Morning Coffee",
    category: "Food & Dining",
    amount: -4.5,
    date: "Today",
    time: "9:30 AM",
    icon: "cafe-outline",
    type: "expense",
  },
  {
    id: "2",
    title: "Freelance Payment",
    category: "Income",
    amount: 850.0,
    date: "Yesterday",
    time: "2:15 PM",
    icon: "card-outline",
    type: "income",
  },
  {
    id: "3",
    title: "Uber Ride",
    category: "Transport",
    amount: -12.3,
    date: "Yesterday",
    time: "7:45 PM",
    icon: "car-outline",
    type: "expense",
  },
  {
    id: "4",
    title: "Grocery Shopping",
    category: "Shopping",
    amount: -67.89,
    date: "2 days ago",
    time: "11:20 AM",
    icon: "bag-outline",
    type: "expense",
  },
  {
    id: "5",
    title: "Netflix Subscription",
    category: "Subscriptions",
    amount: -15.99,
    date: "3 days ago",
    time: "12:00 PM",
    icon: "play-outline",
    type: "expense",
  },
  {
    id: "6",
    title: "Salary",
    category: "Income",
    amount: 3200.0,
    date: "5 days ago",
    time: "9:00 AM",
    icon: "briefcase-outline",
    type: "income",
  },
];

const savingsGoals: Goal[] = [
  {
    id: "1",
    title: "Vacation Fund",
    target: 2000,
    current: 1250,
    icon: "airplane-outline",
  },
  {
    id: "2",
    title: "Emergency Fund",
    target: 5000,
    current: 3200,
    icon: "shield-outline",
  },
  {
    id: "3",
    title: "New Laptop",
    target: 1500,
    current: 890,
    icon: "laptop-outline",
  },
  {
    id: "4",
    title: "Car Down Payment",
    target: 8000,
    current: 2400,
    icon: "car-sport-outline",
  },
];

const monthlyBudgets: Budget[] = [
  {
    category: "Food & Dining",
    limit: 300,
    spent: 145.5,
    icon: "restaurant-outline",
  },
  {
    category: "Transport",
    limit: 150,
    spent: 67.3,
    icon: "car-outline",
  },
  {
    category: "Shopping",
    limit: 200,
    spent: 189.2,
    icon: "bag-outline",
  },
  {
    category: "Entertainment",
    limit: 100,
    spent: 45.0,
    icon: "game-controller-outline",
  },
];

const categories = [
  { name: "All", icon: "grid-outline" as keyof typeof Ionicons.glyphMap },
  {
    name: "Food",
    icon: "restaurant-outline" as keyof typeof Ionicons.glyphMap,
  },
  { name: "Transport", icon: "car-outline" as keyof typeof Ionicons.glyphMap },
  { name: "Shopping", icon: "bag-outline" as keyof typeof Ionicons.glyphMap },
  {
    name: "Income",
    icon: "trending-up-outline" as keyof typeof Ionicons.glyphMap,
  },
  {
    name: "Entertainment",
    icon: "game-controller-outline" as keyof typeof Ionicons.glyphMap,
  },
  {
    name: "Subscriptions",
    icon: "refresh-outline" as keyof typeof Ionicons.glyphMap,
  },
];

export default function MoneySpendingTracker() {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState<"overview" | "goals" | "budget">(
    "overview"
  );
  const [newTransaction, setNewTransaction] = useState({
    title: "",
    amount: "",
    category: "Food & Dining",
    type: "expense" as "income" | "expense",
  });

  const cardAnimation = useSharedValue(1);
  const pulseAnimation = useSharedValue(1);
  const shimmerAnimation = useSharedValue(-1);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const pulseInterval = setInterval(() => {
      pulseAnimation.value = withSequence(
        withTiming(1.1, { duration: 600 }),
        withTiming(1, { duration: 600 })
      );
    }, 4000);

    shimmerAnimation.value = withRepeat(
      withTiming(1, { duration: 2000, easing: Easing.linear }),
      -1,
      false
    );

    return () => {
      clearInterval(pulseInterval);
    };
  }, []);

  const animatedCardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(cardAnimation.value) }],
  }));

  const animatedPulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseAnimation.value }],
  }));

  const animatedShimmerStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: interpolate(
          shimmerAnimation.value,
          [-1, 1],
          [-width, width]
        ),
      },
    ],
  }));

  const filteredTransactions =
    selectedCategory === "All"
      ? transactions
      : transactions.filter((t) =>
          selectedCategory === "Income"
            ? t.type === "income"
            : t.category.toLowerCase().includes(selectedCategory.toLowerCase())
        );

  const totalBalance =
    transactions.reduce((sum, t) => sum + t.amount, 0) + 2000;
  const monthlyIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const monthlyExpenses = Math.abs(
    transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0)
  );

  const addTransaction = () => {
    if (!newTransaction.title || !newTransaction.amount) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    const transaction: Transaction = {
      id: Date.now().toString(),
      title: newTransaction.title,
      category: newTransaction.category,
      amount:
        newTransaction.type === "income"
          ? parseFloat(newTransaction.amount)
          : -parseFloat(newTransaction.amount),
      date: "Today",
      time: currentTime.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
      icon: getIconForCategory(newTransaction.category),
      type: newTransaction.type,
    };

    setTransactions([transaction, ...transactions]);
    setNewTransaction({
      title: "",
      amount: "",
      category: "Food & Dining",
      type: "expense",
    });
    setShowAddModal(false);

    cardAnimation.value = withSequence(
      withSpring(0.95),
      withSpring(1.05),
      withSpring(1)
    );
  };

  const getIconForCategory = (
    category: string
  ): keyof typeof Ionicons.glyphMap => {
    const iconMap: { [key: string]: keyof typeof Ionicons.glyphMap } = {
      "Food & Dining": "restaurant-outline",
      Transport: "car-outline",
      Shopping: "bag-outline",
      Subscriptions: "refresh-outline",
      Income: "trending-up-outline",
      Entertainment: "game-controller-outline",
    };
    return iconMap[category] || "ellipse-outline";
  };

  const deleteTransaction = (id: string) => {
    Alert.alert(
      "Delete Transaction",
      "Are you sure you want to delete this transaction?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setTransactions(transactions.filter((t) => t.id !== id));
          },
        },
      ]
    );
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const getTrendIcon = () => {
    const thisMonthBalance = monthlyIncome - monthlyExpenses;
    return thisMonthBalance > 0 ? "trending-up" : "trending-down";
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "goals":
        return (
          <View style={styles.tabContent}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Savings Goals</Text>
              <TouchableOpacity style={styles.addButton}>
                <Ionicons name="add" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.goalsScroll}
            >
              {savingsGoals.map((goal) => {
                const progress = (goal.current / goal.target) * 100;
                return (
                  <View key={goal.id} style={styles.goalCard}>
                    <View style={styles.goalHeader}>
                      <View style={styles.goalIcon}>
                        <Ionicons name={goal.icon} size={24} color="#FFFFFF" />
                      </View>
                      <Text style={styles.goalProgress}>
                        {Math.round(progress)}%
                      </Text>
                    </View>
                    <Text style={styles.goalTitle}>{goal.title}</Text>
                    <Text style={styles.goalAmount}>
                      ${goal.current.toLocaleString()} / $
                      {goal.target.toLocaleString()}
                    </Text>
                    <View style={styles.progressBar}>
                      <View
                        style={[styles.progressFill, { width: `${progress}%` }]}
                      />
                    </View>
                    <TouchableOpacity style={styles.addFundsButton}>
                      <Ionicons name="add" size={16} color="#000000" />
                      <Text style={styles.addFundsText}>Add Funds</Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        );

      case "budget":
        return (
          <View style={styles.tabContent}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Monthly Budget</Text>
              <TouchableOpacity style={styles.addButton}>
                <Ionicons name="settings" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
            <View style={styles.budgetList}>
              {monthlyBudgets.map((budget, index) => {
                const percentage = (budget.spent / budget.limit) * 100;
                const isOverBudget = percentage > 100;

                return (
                  <View key={index} style={styles.budgetItem}>
                    <View style={styles.budgetHeader}>
                      <View style={styles.budgetLeft}>
                        <View style={styles.budgetIcon}>
                          <Ionicons
                            name={budget.icon}
                            size={20}
                            color="#FFFFFF"
                          />
                        </View>
                        <View>
                          <Text style={styles.budgetCategory}>
                            {budget.category}
                          </Text>
                          <Text style={styles.budgetAmount}>
                            ${budget.spent.toFixed(2)} / $
                            {budget.limit.toFixed(2)}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.budgetRight}>
                        <Text
                          style={[
                            styles.budgetPercentage,
                            { color: isOverBudget ? "#FFFFFF" : "#888888" },
                          ]}
                        >
                          {percentage.toFixed(0)}%
                        </Text>
                        {isOverBudget && (
                          <Ionicons name="warning" size={16} color="#FFFFFF" />
                        )}
                      </View>
                    </View>
                    <View style={styles.budgetProgressBar}>
                      <View
                        style={[
                          styles.budgetProgressFill,
                          {
                            width: `${Math.min(percentage, 100)}%`,
                            backgroundColor: isOverBudget
                              ? "#FFFFFF"
                              : "#888888",
                          },
                        ]}
                      />
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        );

      default:
        return (
          <View style={styles.tabContent}>
            <Animated.View style={[styles.balanceSection, animatedCardStyle]}>
              <View style={styles.balanceCard}>
                <View style={styles.shimmerContainer}>
                  <Animated.View
                    style={[styles.shimmerEffect, animatedShimmerStyle]}
                  />
                </View>
                <View style={styles.balanceHeader}>
                  <Text style={styles.balanceLabel}>Total Balance</Text>
                  <TouchableOpacity
                    style={styles.visibilityButton}
                    onPress={() => setBalanceVisible(!balanceVisible)}
                  >
                    <Ionicons
                      name={balanceVisible ? "eye-outline" : "eye-off-outline"}
                      size={20}
                      color="#888888"
                    />
                  </TouchableOpacity>
                </View>
                <View style={styles.balanceAmountContainer}>
                  <Text style={styles.balanceAmount}>
                    {balanceVisible
                      ? `$${totalBalance.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                        })}`
                      : "••••••••"}
                  </Text>
                  <Ionicons name={getTrendIcon()} size={24} color="#FFFFFF" />
                </View>

                <View style={styles.balanceStats}>
                  <View style={styles.statItem}>
                    <View style={styles.statIconContainer}>
                      <View style={styles.statIcon}>
                        <Ionicons
                          name="trending-up"
                          size={20}
                          color="#FFFFFF"
                        />
                      </View>
                      <View style={styles.statInfo}>
                        <Text style={styles.statLabel}>Income</Text>
                        <Text style={styles.statValue}>
                          +$
                          {balanceVisible
                            ? monthlyIncome.toLocaleString()
                            : "••••"}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.statDivider} />

                  <View style={styles.statItem}>
                    <View style={styles.statIconContainer}>
                      <View style={styles.statIcon}>
                        <Ionicons
                          name="trending-down"
                          size={20}
                          color="#FFFFFF"
                        />
                      </View>
                      <View style={styles.statInfo}>
                        <Text style={styles.statLabel}>Expenses</Text>
                        <Text style={styles.statValue}>
                          -$
                          {balanceVisible
                            ? monthlyExpenses.toLocaleString()
                            : "••••"}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </Animated.View>

            <View style={styles.quickActionsSection}>
              <Text style={styles.quickActionsTitle}>Quick Actions</Text>
              <View style={styles.quickActions}>
                <TouchableOpacity style={styles.quickActionButton}>
                  <View style={styles.quickActionIcon}>
                    <Ionicons
                      name="paper-plane-outline"
                      size={24}
                      color="#FFFFFF"
                    />
                  </View>
                  <Text style={styles.quickActionText}>Send</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.quickActionButton}>
                  <View style={styles.quickActionIcon}>
                    <Ionicons
                      name="download-outline"
                      size={24}
                      color="#FFFFFF"
                    />
                  </View>
                  <Text style={styles.quickActionText}>Request</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.quickActionButton}
                  onPress={() => setShowAddModal(true)}
                >
                  <View style={styles.quickActionIcon}>
                    <Ionicons name="add-outline" size={24} color="#FFFFFF" />
                  </View>
                  <Text style={styles.quickActionText}>Add</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.quickActionButton}
                  onPress={() => setShowAnalyticsModal(true)}
                >
                  <View style={styles.quickActionIcon}>
                    <Ionicons
                      name="analytics-outline"
                      size={24}
                      color="#FFFFFF"
                    />
                  </View>
                  <Text style={styles.quickActionText}>Analytics</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        );
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.userName}>rit3zh</Text>
          </View>
          <View style={styles.headerRight}>
            <Animated.View style={animatedPulseStyle}>
              <TouchableOpacity style={styles.notificationButton}>
                <Ionicons
                  name="notifications-outline"
                  size={24}
                  color="#FFFFFF"
                />
                <View style={styles.notificationDot} />
              </TouchableOpacity>
            </Animated.View>
            <TouchableOpacity style={styles.avatarButton}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>RZ</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.tabNavigation}>
          {[
            { key: "overview", label: "Overview", icon: "home-outline" },
            { key: "goals", label: "Goals", icon: "trophy-outline" },
            { key: "budget", label: "Budget", icon: "pie-chart-outline" },
          ].map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.tabButton,
                activeTab === tab.key && styles.activeTabButton,
              ]}
              onPress={() => setActiveTab(tab.key as any)}
            >
              <Ionicons
                name={tab.icon as keyof typeof Ionicons.glyphMap}
                size={20}
                color={activeTab === tab.key ? "#000000" : "#888888"}
              />
              <Text
                style={[
                  styles.tabButtonText,
                  activeTab === tab.key && styles.activeTabButtonText,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {renderTabContent()}

        {activeTab === "overview" && (
          <View style={styles.categoriesSection}>
            <Text style={styles.categoriesTitle}>Filter Transactions</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.categoriesScroll}
            >
              {categories.map((category, index) => {
                const isSelected = selectedCategory === category.name;
                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => setSelectedCategory(category.name)}
                    style={[
                      styles.categoryChip,
                      isSelected && styles.categoryChipSelected,
                    ]}
                  >
                    <Ionicons
                      name={category.icon}
                      size={18}
                      color={isSelected ? "#000000" : "#888888"}
                    />
                    <Text
                      style={[
                        styles.categoryText,
                        isSelected && styles.categoryTextSelected,
                      ]}
                    >
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}

        {activeTab === "overview" && (
          <View style={styles.transactionsSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                {selectedCategory === "All"
                  ? "Recent Transactions"
                  : `${selectedCategory} Transactions`}
              </Text>
              <View style={styles.transactionCount}>
                <Text style={styles.transactionCountText}>
                  {filteredTransactions.length}
                </Text>
              </View>
            </View>

            <View style={styles.transactionsList}>
              {filteredTransactions.map((transaction, index) => {
                return (
                  <View key={transaction.id}>
                    <TouchableOpacity
                      style={styles.transactionItem}
                      activeOpacity={0.7}
                      onLongPress={() => deleteTransaction(transaction.id)}
                    >
                      <View style={styles.transactionLeft}>
                        <View style={styles.transactionIcon}>
                          <Ionicons
                            name={transaction.icon}
                            size={22}
                            color="#FFFFFF"
                          />
                        </View>
                        <View style={styles.transactionInfo}>
                          <Text style={styles.transactionTitle}>
                            {transaction.title}
                          </Text>
                          <Text style={styles.transactionMeta}>
                            {transaction.category} • {transaction.date} •{" "}
                            {transaction.time}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.transactionRight}>
                        <Text
                          style={[
                            styles.transactionAmount,
                            {
                              color:
                                transaction.type === "income"
                                  ? "#FFFFFF"
                                  : "#888888",
                            },
                          ]}
                        >
                          {transaction.type === "income" ? "+" : ""}$
                          {Math.abs(transaction.amount).toFixed(2)}
                        </Text>
                        <Ionicons
                          name="chevron-forward"
                          size={16}
                          color="#444444"
                        />
                      </View>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          </View>
        )}
      </ScrollView>

      <Modal
        visible={showAddModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Transaction</Text>
              <TouchableOpacity
                onPress={() => setShowAddModal(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={26} color="#888888" />
              </TouchableOpacity>
            </View>

            <View style={styles.typeSelector}>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  newTransaction.type === "expense" &&
                    styles.typeButtonSelected,
                ]}
                onPress={() =>
                  setNewTransaction({ ...newTransaction, type: "expense" })
                }
              >
                <Ionicons
                  name="remove-circle-outline"
                  size={20}
                  color={
                    newTransaction.type === "expense" ? "#000000" : "#888888"
                  }
                />
                <Text
                  style={[
                    styles.typeButtonText,
                    newTransaction.type === "expense" &&
                      styles.typeButtonTextSelected,
                  ]}
                >
                  Expense
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  newTransaction.type === "income" && styles.typeButtonSelected,
                ]}
                onPress={() =>
                  setNewTransaction({ ...newTransaction, type: "income" })
                }
              >
                <Ionicons
                  name="add-circle-outline"
                  size={20}
                  color={
                    newTransaction.type === "income" ? "#000000" : "#888888"
                  }
                />
                <Text
                  style={[
                    styles.typeButtonText,
                    newTransaction.type === "income" &&
                      styles.typeButtonTextSelected,
                  ]}
                >
                  Income
                </Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Transaction description"
              placeholderTextColor="#666666"
              value={newTransaction.title}
              onChangeText={(text) =>
                setNewTransaction({ ...newTransaction, title: text })
              }
            />

            <TextInput
              style={styles.input}
              placeholder="0.00"
              placeholderTextColor="#666666"
              value={newTransaction.amount}
              onChangeText={(text) =>
                setNewTransaction({ ...newTransaction, amount: text })
              }
              keyboardType="numeric"
            />

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.categorySelector}
            >
              {categories.slice(1).map((category, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.categorySelectorChip,
                    newTransaction.category === category.name &&
                      styles.categorySelectorChipSelected,
                  ]}
                  onPress={() =>
                    setNewTransaction({
                      ...newTransaction,
                      category: category.name,
                    })
                  }
                >
                  <Ionicons
                    name={category.icon}
                    size={16}
                    color={
                      newTransaction.category === category.name
                        ? "#000000"
                        : "#888888"
                    }
                  />
                  <Text
                    style={[
                      styles.categorySelectorText,
                      newTransaction.category === category.name &&
                        styles.categorySelectorTextSelected,
                    ]}
                  >
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={styles.submitButton}
              onPress={addTransaction}
            >
              <Text style={styles.submitButtonText}>Add Transaction</Text>
              <Ionicons name="checkmark" size={20} color="#000000" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showAnalyticsModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAnalyticsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.analyticsModalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Analytics</Text>
              <TouchableOpacity
                onPress={() => setShowAnalyticsModal(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={26} color="#888888" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.analyticsSection}>
                <Text style={styles.analyticsSectionTitle}>
                  Spending by Category
                </Text>
                {categories.slice(1, -1).map((category, index) => {
                  const categorySpending = transactions
                    .filter(
                      (t) =>
                        t.type === "expense" &&
                        t.category
                          .toLowerCase()
                          .includes(category.name.toLowerCase())
                    )
                    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
                  const percentage = (categorySpending / monthlyExpenses) * 100;

                  return (
                    <View key={index} style={styles.analyticsItem}>
                      <View style={styles.analyticsItemHeader}>
                        <View style={styles.analyticsItemLeft}>
                          <Ionicons
                            name={category.icon}
                            size={20}
                            color="#FFFFFF"
                          />
                          <Text style={styles.analyticsItemTitle}>
                            {category.name}
                          </Text>
                        </View>
                        <Text style={styles.analyticsItemAmount}>
                          ${categorySpending.toFixed(2)}
                        </Text>
                      </View>
                      <View style={styles.analyticsProgressBar}>
                        <View
                          style={[
                            styles.analyticsProgressFill,
                            { width: `${percentage}%` },
                          ]}
                        />
                      </View>
                      <Text style={styles.analyticsPercentage}>
                        {percentage.toFixed(1)}%
                      </Text>
                    </View>
                  );
                })}
              </View>

              <View style={styles.analyticsSection}>
                <Text style={styles.analyticsSectionTitle}>
                  Financial Health
                </Text>
                <View style={styles.healthScoreContainer}>
                  <View style={styles.healthScoreCircle}>
                    <Text style={styles.healthScoreText}>
                      {Math.round(
                        ((monthlyIncome - monthlyExpenses) / monthlyIncome) *
                          100
                      )}
                    </Text>
                    <Text style={styles.healthScoreLabel}>Score</Text>
                  </View>
                  <View style={styles.healthScoreInfo}>
                    <Text style={styles.healthScoreTitle}>
                      {monthlyIncome - monthlyExpenses > monthlyIncome * 0.2
                        ? "Excellent"
                        : monthlyIncome - monthlyExpenses > 0
                        ? "Good"
                        : "Needs Improvement"}
                    </Text>
                    <Text style={styles.healthScoreDescription}>
                      You're saving{" "}
                      {(
                        ((monthlyIncome - monthlyExpenses) / monthlyIncome) *
                        100
                      ).toFixed(1)}
                      % of your income
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.analyticsSection}>
                <Text style={styles.analyticsSectionTitle}>
                  Weekly Spending Trend
                </Text>
                <View style={styles.trendChart}>
                  {[65, 120, 95, 180, 150, 90, 75].map((amount, index) => (
                    <View key={index} style={styles.trendBarContainer}>
                      <View
                        style={[
                          styles.trendBar,
                          { height: (amount / 200) * 100 },
                        ]}
                      />
                      <Text style={styles.trendDay}>
                        {
                          ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][
                            index
                          ]
                        }
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
      <FloatingActionButton />
    </View>
  );
}
