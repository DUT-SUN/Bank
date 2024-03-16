#!/usr/bin/env python
# coding: utf-8

# In[3]:

def train(dir):
    from sklearn.impute import SimpleImputer
    import pandas as pd
    from scipy.stats import spearmanr

    # 加载数据
    df = pd.read_csv(dir, encoding='gbk')
    # 处理缺失值
    imputer = SimpleImputer(strategy='median')  # 可以根据需求选择填充策略
    df_imputed = pd.DataFrame(imputer.fit_transform(df), columns=df.columns)
    # 计算斯皮尔曼相关系数
    correlations = {}
    for feature in df_imputed.columns[:-1]:
        if len(df_imputed[feature].unique()) == 1:
            print(f"Skipping constant feature: {feature}")
            continue
        # 检查特征的方差
        if df_imputed[feature].var() == 0:
            print(f"Skipping feature with zero variance: {feature}")
            continue
        corr, _ = spearmanr(df_imputed[feature], df_imputed[df_imputed.columns[-1]], nan_policy='omit')
        correlations[feature] = abs(corr)

    # 按照斯皮尔曼相关系数排序
    sorted_correlations = sorted(correlations.items(), key=lambda x: x[1], reverse=True)
    top_15_features = [f for f in sorted_correlations ][:15]
    print("Top 15 features without significant collinearity:")
    for feature, corr in top_15_features:
        print(f"{feature}: {corr}")
    import numpy as np
    # 提取前15个特征作为因变量
    selected_features = [f[0] for f in top_15_features]


    # In[6]:


    import pickle

    # 假设这里的top_15_features是你要保存的十五个变量
    with open('top_15_features.pickle', 'wb') as f:
        pickle.dump(top_15_features, f)


    # In[4]:


    # 从 DataFrame 中提取选定的特征列，并转换为 float32 格式
    X = df_imputed.loc[:, selected_features].values.astype(np.float32)

    # 提取因变量并转换为 float32 格式
    y = df.iloc[:, -1].values.reshape(-1, 1).astype(np.float32)
    # 打印 ndarray 的形状
    print("Shape of X:", X.shape)
    print("Shape of y:", y.shape)


    # In[7]:


    import numpy as np

    min_vals = np.min(X, axis=0)
    max_vals = np.max(X, axis=0)
    denominator = max_vals - min_vals
    denominator[denominator == 0] = 1  # 将分母为0的情况设为1，避免除以0
    # 对数据进行Min-Max归一化
    normalized_X = (X - min_vals) / denominator
    from sklearn.model_selection import train_test_split
    X_train, X_val, y_train, y_val = train_test_split(normalized_X, y, test_size=0.3)
    from sklearn.ensemble import GradientBoostingClassifier
    from imblearn.over_sampling import SMOTE
    from sklearn.metrics import accuracy_score, recall_score
    smote = SMOTE(k_neighbors=5, random_state=42,sampling_strategy=0.3)
    trainX, trainY = smote.fit_resample(X_train, y_train)

    import numpy as np
    # 假设 min_vals 和 max_vals 是你在训练集上计算得到的最小值和最大值
    # 将最小值和最大值保存到文件中
    np.savez('scaling_params.npz', min_vals=min_vals, max_vals=max_vals)


    # In[32]:


    from sklearn.svm import SVC
    svmModel = SVC(kernel='rbf',gamma='auto',class_weight={0: 1, 1: 6})
    svmModel.fit(trainX, trainY )
    svmLabels = svmModel.predict(X_val)
    accuracy = accuracy_score(y_val, svmLabels)
    print('SVM 准确率:', accuracy)
    recall = recall_score(y_val, svmLabels, pos_label=1)
    print('召回率:', recall)


    # In[38]:


    from joblib import dump
    # 保存模型
    dump(svmModel, 'svmModel.joblib')


    # In[35]:


    from sklearn.tree import DecisionTreeClassifier
    from sklearn.ensemble import AdaBoostClassifier
    from sklearn.metrics import accuracy_score, recall_score

    # 创建决策树分类器
    t = DecisionTreeClassifier(max_leaf_nodes=10, random_state=42)
    # 创建AdaBoost分类器
    boostedTreeModel = AdaBoostClassifier(
        estimator=t,
        n_estimators=100,
        algorithm='SAMME',
        random_state=42
    )
    sample_weight = [1 if y == 0 else 10 for y in trainY]
    boostedTreeModel.fit(trainX, trainY, sample_weight=sample_weight)
    boostedTreeLabels = boostedTreeModel.predict(X_val)
    accuracy = accuracy_score(y_val, boostedTreeLabels)
    print('Boosted Tree Accuracy:', accuracy)
    recall = recall_score(y_val, boostedTreeLabels, pos_label=1)
    print('Recall:', recall)


    # In[39]:


    from joblib import dump
    # 保存模型
    dump(boostedTreeModel, 'boostedTreeModel.joblib')


    # In[26]:


    from sklearn.linear_model import LogisticRegression
    class_weights = {0: 1, 1: 5}
    logistic_model = LogisticRegression(class_weight=class_weights,random_state=42)
    logistic_model.fit(trainX, trainY)
    logistic_labels = logistic_model.predict(X_val)
    accuracy = accuracy_score(y_val, logistic_labels)
    print('Logistic Regression Accuracy:', accuracy)
    recall = recall_score(y_val, logistic_labels, pos_label=1)
    print('Recall:', recall)


    # In[37]:


    from joblib import dump
    # 保存模型
    dump(logistic_model, 'logistic_model.joblib')


    # In[31]:


    from sklearn.discriminant_analysis import LinearDiscriminantAnalysis
    from sklearn.metrics import accuracy_score

    # 定义类别权重，正类别的权重为10，负类别的权重为1
    class_weights = {0: 1, 1: 5}

    # 复制正类别样本以增强正类别权重
    trainX_weighted = []
    trainY_weighted = []
    for i, x in enumerate(trainX):
        trainX_weighted.append(x)
        trainY_weighted.append(trainY[i])
        if trainY[i] == 1:
            # 根据正类别的权重重复样本
            for _ in range(class_weights[1] - 1):
                trainX_weighted.append(x)
                trainY_weighted.append(trainY[i])
    lda_model = LinearDiscriminantAnalysis()
    lda_model.fit(trainX_weighted, trainY_weighted)
    lda_labels = lda_model.predict(X_val)
    accuracy = accuracy_score(y_val, lda_labels)
    print('Fisher Linear Discriminant Analysis Accuracy:', accuracy)
    recall = recall_score(y_val, lda_labels, pos_label=1)
    print('Recall:', recall)


    # In[36]:


    from joblib import dump
    # 保存模型
    dump(lda_model, 'lda_model.joblib')


    # In[23]:


    from sklearn.ensemble import RandomForestClassifier
    from sklearn.metrics import accuracy_score
    class_weight = {0: 1, 1: 100}
    # 创建随机森林分类器
    clf = RandomForestClassifier(n_estimators=100, random_state=42)
    sample_weight = [1 if y == 0 else 100 for y in trainY]
    # 使用训练数据训练模型
    clf.fit(trainX, trainY,sample_weight=sample_weight)

    # 使用训练好的模型进行预测
    predictions = clf.predict(X_val)

    # 计算准确率
    accuracy = accuracy_score(y_val, predictions)
    print("Accuracy:", accuracy)
    # 计算召回率
    recall = recall_score(y_val, predictions, pos_label=1)
    print('召回率:', recall)

    from joblib import dump
    # 保存模型
    dump(clf, 'random_forest_model.joblib')


    # In[20]:


    from sklearn.ensemble import AdaBoostClassifier
    from sklearn.metrics import accuracy_score, recall_score
    from joblib import dump
    class_weights = {0: 1., 1: 5.}  # 负类权重为1，正类权重为10
    # 创建AdaBoost分类器
    boosted_model = AdaBoostClassifier(
        n_estimators=60,
        algorithm='SAMME',
        random_state=42
    )
    # 在训练时应用类别权重
    boosted_model.fit(trainX, trainY, sample_weight=[class_weights[yi] for yi in trainY])
    # 在验证集上进行预测
    boosted_labels = boosted_model.predict(X_val)
    # 评估模型性能
    accuracy = accuracy_score(y_val, boosted_labels)
    recall = recall_score(y_val, boosted_labels, pos_label=1)
    print('Boosted Tree Accuracy:', accuracy)
    print('Recall:', recall)
    # 保存模型
    dump(boosted_model, 'boosted_model.joblib')

    # # 加载模型
    # loaded_model = load('boosted_model.joblib')


    # In[16]:


    from keras import Sequential
    from keras.layers import Dense,Dropout,BatchNormalization,Activation,Dropout
    model=Sequential()
    model.add(Dense(512))
    model.add(BatchNormalization())
    model.add(Activation('relu'))
    model.add(Dropout(0.3))
    model.add(Dense(256))
    model.add(BatchNormalization())
    model.add(Activation('relu'))
    model.add(Dropout(0.3))
    # model.add(Dense(64))
    # model.add(BatchNormalization())
    # model.add(Activation('relu'))
    model.add(Dense(1))
    model.add(Activation('sigmoid'))

    model.compile(optimizer='adam', loss='binary_crossentropy')
    class_weights={0:1,1:5}
    history=model.fit(trainX,trainY,
                      epochs=100,
                      shuffle=True,
                      class_weight=class_weights)


    # In[77]:


    predictions = model.predict(X_val)
    y_pred_classes = (predictions > 0.5).astype(int)
    from sklearn.metrics import accuracy_score ,recall_score

    accuracy = accuracy_score(y_val, y_pred_classes)
    print(f"Accuracy: {accuracy}")


    # 注意：召回率是针对正类（标签为1）的性能指标
    recall = recall_score(y_val, y_pred_classes)
    print(f"Recall: {recall}")


    # In[18]:


    model.save('model.keras')


    # In[84]:


    from joblib import load
    from keras.models import load_model
    model1=load('boostedTreeModel.joblib')
    model2=load('lda_model.joblib')
    model3=load('boosted_model.joblib')
    model4=load('logistic_model.joblib')
    model5=load('svmModel.joblib')
    model6=load('random_forest_model.joblib')
    model7=load_model('model.keras')

    # 对每个模型进行预测
    predictions1 = np.where(model1.predict(X_val) > 0.5, 1, 0)
    predictions2 = np.where(model2.predict(X_val) > 0.5, 1, 0)
    predictions3 = np.where(model3.predict(X_val) > 0.5, 1, 0)
    predictions4 = np.where(model4.predict(X_val) > 0.5, 1, 0)
    predictions5 = np.where(model5.predict(X_val) > 0.5, 1, 0)
    predictions6 = np.where(model6.predict(X_val) > 0.5, 1, 0)
    predictions7 = np.where(model7.predict(X_val) > 0.5, 1, 0)

    # 定义模型权重
    weights = [0.3, 0.1, 0.5, 0.1, 0.2, 0.1,1]

    # 对每个模型的预测结果进行加权

    ans0=weights[0] * predictions1
    ans1=weights[1] * predictions2
    ans2=weights[2] * predictions3
    ans3=weights[3] * predictions4
    ans4=weights[4] * predictions5
    ans5=weights[5] * predictions6
    ans6=(weights[6] * predictions7).reshape(-1,)



    # In[54]:


    print(ans0.shape)
    print(ans1.shape)
    print(ans2.shape)
    print(ans3.shape)
    print(ans4.shape)
    print(ans5.shape)
    print(ans6.shape)


    # In[85]:


    ans=(ans0+ans1+ans2+ans3+ans4+ans5+ans6)/np.sum(weights)


    # In[86]:


    # 对加权结果进行二分类，使用 0.5 作为阈值
    binary_predictions = (ans > 0.5).astype(int)

    # 输出二分类结果
    print("Binary Predictions:", binary_predictions)

    # 计算加权分类的准确率
    accuracy = accuracy_score(y_val, binary_predictions)
    print("Weighted Classification Accuracy:", accuracy)

    recall=recall_score(y_val, binary_predictions)
    print("Weighted Classification Recall:", recall)

if __name__ == '__main__':
    import sys

    filename = sys.argv[1]  # 第一个命令行参数是文件名
    # 或者默认是filename='data.csv'，这一行和上一行二选一
    train(filename)

