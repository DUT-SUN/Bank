#%%
##

def cal(dir):
    import pickle
    from sklearn.impute import SimpleImputer
    import numpy as np

    # 加载保存的变量
    with open(r'C:\Users\lenovo\Desktop\blog-server\src\controller\code\top_15_features.pickle', 'rb') as f:
        top_15_features = pickle.load(f)

    # 现在你可以使用这些变量了
    # print(top_15_features)
    import pandas as pd          
    # 加载测试集
    # 加载数据
    df = pd.read_csv(r'C:\Users\lenovo\Desktop\blog-server\src\controller\code\data.csv', encoding='gbk')
    # 处理缺失值
    imputer = SimpleImputer(strategy='median')  # 可以根据需求选择填充策略
    df_imputed = pd.DataFrame(imputer.fit_transform(df), columns=df.columns)
    # 根据top_15_features选择相应的特征列
    selected_features = [f[0] for f in top_15_features]
    # 现在selected_test_features中包含了测试集中的十五个特征变量
    X = df_imputed.loc[:, selected_features].values.astype(np.float32)

    # 提取因变量并转换为 float32 格式
    #y = df.iloc[:, -1].values.reshape(-1, 1).astype(np.float32)
    #%%
    ##
    import numpy as np

    # 加载归一化参数
    scaling_params = np.load(r'C:\Users\lenovo\Desktop\blog-server\src\controller\code\scaling_params.npz')
    min_vals = scaling_params['min_vals']
    max_vals = scaling_params['max_vals']

    # 假设 X_test 是测试集的特征数据

    # 使用训练集的最小值和最大值对测试集进行归一化
    normalized_X = (X - min_vals) / (max_vals - min_vals)
    #%%
    ##
    import tensorflow as tf
    from joblib import load
    from tensorflow.keras.models import load_model
    model1 = load(r'C:\Users\lenovo\Desktop\blog-server\src\controller\code\boostedTreeModel.pkl')
    model2 = load(r'C:\Users\lenovo\Desktop\blog-server\src\controller\code\lda_model.pkl')
    model3 = load(r'C:\Users\lenovo\Desktop\blog-server\src\controller\code\boosted_model.pkl')
    model4 = load(r'C:\Users\lenovo\Desktop\blog-server\src\controller\code\logistic_model.pkl')
    model5 = load(r'C:\Users\lenovo\Desktop\blog-server\src\controller\code\svmModel.pkl')
    model6 = load(r'C:\Users\lenovo\Desktop\blog-server\src\controller\code\random_forest_model.pkl')
    model7 = tf.keras.models.load_model(r'C:\Users\lenovo\Desktop\blog-server\src\controller\code\model.h5', compile=False)
    #%%
    ##
    # 对每个模型进行预测
    predictions1 = np.where(model1.predict(normalized_X) > 0.5, 1, 0)
    predictions2 = np.where(model2.predict(normalized_X) > 0.5, 1, 0)
    predictions3 = np.where(model3.predict(normalized_X) > 0.5, 1, 0)
    predictions4 = np.where(model4.predict(normalized_X) > 0.5, 1, 0)
    predictions5 = np.where(model5.predict(normalized_X) > 0.5, 1, 0)
    predictions6 = np.where(model6.predict(normalized_X) > 0.5, 1, 0)
    predictions7 = np.where(model7.predict(normalized_X) > 0.5, 1, 0)

    # 定义模型权重
    weights = [0.3, 0.1, 0.5, 0.1, 0.2, 0.1,1]  # 举例，你可以根据实际情况调整权重

    # 对每个模型的预测结果进行加权

    ans0=weights[0] * predictions1
    ans1=weights[1] * predictions2
    ans2=weights[2] * predictions3
    ans3=weights[3] * predictions4
    ans4=weights[4] * predictions5
    ans5=weights[5] * predictions6
    ans6=(weights[6] * predictions7).reshape(-1,)

    ans=(ans0+ans1+ans2+ans3+ans4+ans5+ans6)/np.sum(weights)
    binary_predictions = (ans > 0.5).astype(int)
    return binary_predictions
#%%
##
import pandas as pd
def res(result):
    # 假设您的cal函数返回一个行向量，存储在变量 result 中

    # 转置行向量为列向量
    column_vector = pd.DataFrame(result, columns=['column_name'])

    # 将列向量存储到DataFrame中
    df = pd.DataFrame({'column_name': column_vector['column_name']})

    return df

if __name__ == '__main__':
    import sys
    filename = sys.argv[1]  # 第一个命令行参数是文件名
    #或者默认是filename='data.csv'，这一行和上一行二选一


    #print(cal(filename)[:10])
    df=res(cal(filename))
    df.to_csv('output.csv', index=False)
    #python calculate.py data.csv
    import pandas as pd
def res(result):
    # 假设您的cal函数返回一个行向量，存储在变量 result 中
    # 转置行向量为列向量
    column_vector = pd.DataFrame(result, columns=['column_name'])
    # 将列向量存储到DataFrame中
    df = pd.DataFrame({'column_name': column_vector['column_name']})
    return df

if __name__ == '__main__':
    import sys
    filename = sys.argv[1]  # 第一个命令行参数是文件名
    #或者默认是filename='data.csv'，这一行和上一行二选一
    #print(cal(filename)[:10])
    df2=res(cal(filename))
    df2.to_csv('output.csv', index=False)
    #python calculate.py data.csv
    # 读取 output.csv 文件
    import json
    # 读取 output.csv 文件
    df2 = pd.read_csv('output.csv')
    # 筛选出标注为1的行
    df1 = df2[df2['column_name'] == 1]
    # 找出值为1的元素所在的行
    rows = df1.index.tolist()
    pd.set_option('display.max_rows', None)
    pd.set_option('display.max_columns', None)
    # print(rows)
    df = pd.read_csv(r'C:\Users\lenovo\Desktop\blog-server\src\controller\code\data.csv', encoding='gbk')
    selected_rows = df.iloc[rows]
    # 将选定的行保存为CSV文件
    selected_rows.to_csv(r'C:\Users\lenovo\Desktop\blog-server\src\controller\code\res.csv', index=False)

