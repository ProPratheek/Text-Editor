#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

int minTimeToWalk(int N, vector<int>& Pain) {
    // Sort the pain levels in ascending order
    sort(Pain.begin(), Pain.end());
    
    // Initialize total time
    int totalTime = 0;
    
    // Distribute distances to minimize total time
    for (int i = 0; i < N; ++i) {
        totalTime += (i + 1) * Pain[i];
    }
    
    return totalTime;
}

int main() {
    int N;
    cin >> N;  // Total kilometers to be covered
    
    int numMembers;
    cin >> numMembers;
    vector<int> Pain(numMembers);  // Pain levels of team members
    
    for (int i = 0; i < numMembers; ++i) {
        cin >> Pain[i];
    }
    
    int result = minTimeToWalk(N, Pain);
    cout << result << endl;  // Output the minimum time required
    
    return 0;
}
